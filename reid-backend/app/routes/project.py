import json
from typing import Optional, List, Dict
from fastapi import APIRouter, Header
from fastapi import FastAPI, File, UploadFile

from app.models.user import User
from app.services import user as user_service
from app.enums import USER_ROLE, PROJECT_STATUS
from app.models.query_item import QueryItemDetail
from app.models.gallery_item import GalleryItemDetail
from app.services import project as project_service
from app.services import query as query_service
from app.exceptions.project import NoProjectFoundException, QueryItemNotFoundException
from app.exceptions.user import UnauthorizedException, NoUserFoundException, InvalidUserRoleException, CreateProjectPermissionDeniedException
from app.models.project import Project, ProjectAssignScheme, ProjectResponseScheme, ChangeStatusScheme
from app.exceptions.project import ChangeStatusPermissionDeniedException, ProjectNotFoundOrNotYoursException
from app.exceptions.file import NotValidJsonFileException
router = APIRouter()


@router.get("/all", response_model=List[ProjectResponseScheme], description="Return List of all projects that user can access")
async def find_all(token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)
    projects = []
    if user.role == USER_ROLE.ADMIN:
        projects = await project_service.find_all(None)
    if user.role == USER_ROLE.REVIEWER:
        assigned_projects = await project_service.find_all({"reviewer": f"{user.username}"})
        free_projects = await project_service.find_all({"status": PROJECT_STATUS.REQ_TO_REVIEW.value})
        projects.extend(assigned_projects)
        projects.extend(free_projects)
    if user.role == USER_ROLE.ANNOTATOR:
        projects = await project_service.find_all({"annotator": f"{user.username}"})
    return [ProjectResponseScheme(**prj) for prj in projects]


@router.get("/{name}", response_model=ProjectResponseScheme, description="Return project that user can access")
async def find_one(name: str, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)
    project = None
    if user.role == USER_ROLE.ADMIN:
        project = await project_service.find_one({"name": name})
    if user.role == USER_ROLE.REVIEWER:
        project = await project_service.find_one({"name": name, "reviewer": f"{user.username}"})
    if user.role == USER_ROLE.ANNOTATOR:
        project = await project_service.find_one({"name": name, "annotator": f"{user.username}"})
    return ProjectResponseScheme(**project)



@router.post("/assign", description="Return List of all projects that user can access")
async def assign_project(assign_info: ProjectAssignScheme, token: Optional[str] = Header(None)):
    target_user = await user_service.find_one({"username": assign_info.username})
    if not target_user:
        raise NoUserFoundException(
            more_info={"username": assign_info.username})

    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    target_user = User(**target_user)
    if target_user.role != assign_info.role:
        raise InvalidUserRoleException(more_info={'role': assign_info.role})

    project = await project_service.find_one({"name": assign_info.project_name})
    if not project:
        raise NoProjectFoundException(
            more_info={"name": assign_info.project_name})

    status = PROJECT_STATUS.TODO
    if target_user.role == USER_ROLE.ANNOTATOR:
        status = PROJECT_STATUS.IN_ANNOTATION.value
    elif target_user.role == USER_ROLE.REVIEWER:
        status = PROJECT_STATUS.IN_REVIEW.value

    await project_service.assign_one(
        name=project['name'], status=status, role=target_user.role, username=target_user.username)

    project = await project_service.find_one({"name": assign_info.project_name})
    return ProjectResponseScheme(**project)


@router.post("/change-status",
             description="""Change status of project\n
            available actions:
                annotator:
                    in_anotation -> req_to_review
                reviewer:
                    req_to_review -> in_review 
                    in_review -> in_annotation | done
                admin:
                    * -> archive
                    archive -> todo
            """, response_model=ProjectResponseScheme)
async def change_project_status(change_status_info: ChangeStatusScheme, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)

    project = await project_service.find_one({"name": change_status_info.project_name})
    if not project:
        raise NoProjectFoundException(
            more_info={"name": change_status_info.project_name})
    project = Project(**project)

    if user.role == USER_ROLE.ANNOTATOR:
        if project.status != PROJECT_STATUS.IN_ANNOTATION or change_status_info.new_status != PROJECT_STATUS.REQ_TO_REVIEW:
            raise ChangeStatusPermissionDeniedException(more_info={
                "from": project.status.value,
                "next": change_status_info.new_status.value})
        await project_service.change_status(
            name=change_status_info.project_name,
            new_status=change_status_info.new_status.value)

    if user.role == USER_ROLE.REVIEWER:
        if (project.status == PROJECT_STATUS.REQ_TO_REVIEW
            and change_status_info.new_status == PROJECT_STATUS.IN_REVIEW) \
                or (project.status == PROJECT_STATUS.IN_REVIEW
                    and (change_status_info.new_status == PROJECT_STATUS.IN_ANNOTATION
                         or change_status_info.new_status == PROJECT_STATUS.DONE)
                    ):
            await project_service.change_status(
                name=change_status_info.project_name,
                new_status=change_status_info.new_status.value)
        else:
            raise ChangeStatusPermissionDeniedException(more_info={
                "from": project.status.value,
                "next": change_status_info.new_status.value})

    if user.role == USER_ROLE.ADMIN:
        if change_status_info.new_status == PROJECT_STATUS.ARCHIVE\
            or (project.status == PROJECT_STATUS.ARCHIVE
                and change_status_info.new_status == PROJECT_STATUS.TODO):
            await project_service.change_status(
                name=change_status_info.project_name,
                new_status=change_status_info.new_status.value)
            if change_status_info.new_status == PROJECT_STATUS.TODO:
                await project_service.clear_reviewer_annotator(name=change_status_info.project_name)
        else:
            raise ChangeStatusPermissionDeniedException(more_info={
                "from": project.status.value,
                "next": change_status_info.new_status.value})

    project = await project_service.find_one({"name": change_status_info.project_name})
    return ProjectResponseScheme(**project)



@router.post("/upload-reid-project/", description="Upload reid project json file")
async def uploadReidProjectJsonFile(file: UploadFile = File(...), token: Optional[str] = Header(None)):
    try:
        username = user_service.decode_token(access_token=token)
        if username is None:
            raise UnauthorizedException()
    except Exception as e:
        raise UnauthorizedException()


    user = await user_service.find_one({"username": username})
    user = User(**user)
    if user.role != USER_ROLE.ADMIN:
        raise CreateProjectPermissionDeniedException()

    # Check if the uploaded file is a JSON file
    if file.content_type != "application/json":
        raise NotValidJsonFileException()

    # Read the contents of the JSON file
    contents = await file.read()

    # Process the JSON contents (you can add your custom logic here)
    try:
        json_data = json.loads(contents)
        project_name = f"NEW----{json_data['meta']['query']}|{json_data['meta']['gallery']}"
        project = Project(
            name = project_name,
            annotator = None,
            reviewer = None,
            status = PROJECT_STATUS.TODO.value,
            query_ids = []
        )
        query_ids = []
        for query_item_data in json_data['reid_result']:
            top_gallery_items = []
            for gallery_item_data in query_item_data['top_gallery_items']:
                top_gallery_items.append(
                    GalleryItemDetail(
                        id=gallery_item_data['id'],
                        master_id=gallery_item_data['master_id'],
                        start=gallery_item_data['start'] if gallery_item_data.get('start', None) else 0,
                        score=gallery_item_data['score'],
                        preview=gallery_item_data['preview'],
                        video=gallery_item_data['video']
                    )
                )
            query_item = QueryItemDetail(
                project_name = project_name,
                id = query_item_data['id'],
                master_id = query_item_data['master_id'],
                start=gallery_item_data['start'] if gallery_item_data.get('start', None) else 0,
                preview = query_item_data['preview'],
                video = query_item_data['video'],
                top_gallery_items = top_gallery_items,
                selected_items = [],
                is_done = False
            )
            query_ids.append(int(query_item_data['master_id']))
            result = await query_service.insert_one(query_item)
        project = Project(
            name = project_name,
            annotator = None,
            reviewer = None,
            status = PROJECT_STATUS.TODO.value,
            query_ids = sorted(query_ids)
        )
        result = await project_service.insert_one(project)

    except Exception as e:
        raise e

@router.get("/detail/{project_name}/query/{query_id}", response_model=QueryItemDetail, description="Get query item details")
async def get_query_detail(
    project_name: str,
    query_id: int,
    token: str = Header(...)
):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)

    if user.role != USER_ROLE.ADMIN:
        project = project_service.find_one(
            {"name": project_name, f"{user.role}": user.username})
        if project is None:
            raise ProjectNotFoundOrNotYoursException(
                more_info={"name": project_name})

    query = await query_service.find_one({"project_name": project_name, "master_id": query_id})
    query = QueryItemDetail(**query)
    return query


@router.post("/detail/{project_name}/query/{query_id}", response_model=QueryItemDetail, 
description="""
update query item selected items, available options in data: 
    selected_items: List[int], list of corelated master ids.
    is_done: bool, query reidentification is complete.
    self_reid: bool, reidentification process is self-reid or not.
""")
async def update_query_item(project_name: str, query_id: int, data: Dict, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)


    if user.role != USER_ROLE.ADMIN:
        project = project_service.find_one(
            {"name": project_name, f"{user.role}": user.username})
        if project is None:
            raise ProjectNotFoundOrNotYoursException(
                more_info={"name": project_name})
    
    if "self_reid" in data.keys() and data['self_reid'] == True:
        for master_id in data['selected_items']:            
            result = await query_service.update_query(project_name, master_id, {"selected_items": list(set(data['selected_items'] + [query_id]))})

    result = await query_service.update_query(project_name, query_id, {"selected_items": data['selected_items'], "is_done": data['is_done']})
    result = await query_service.find_one({"project_name": project_name, "master_id": query_id})

    x = await query_service.find_one({"project_name": project_name, "master_id": query_id})

    return QueryItemDetail(**result)


@router.get("/{project_name}/summary")
async def project_summary(project_name: str, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)

    project = None
    if user.role != USER_ROLE.ADMIN:
        project = await project_service.find_one(
            {"name": project_name, f"{user.role}": user.username})
    else:
        project = await project_service.find_one({"name": project_name})

    if project is None:
        raise ProjectNotFoundOrNotYoursException(
            more_info={"name": project_name})

    project = Project(**project)

    queries = await query_service.find_all({"project_name": project.name})
    new_queries = []
    qq = None
    try:
        for q in queries:
            qq = q
            new_queries.append(QueryItemDetail(**q))
    except:
        print("problem query: ", qq)
        raise Exception()

    queries = new_queries
    query_ids = [q.master_id for q in queries]
    done_query_ids = [q.master_id for q in queries if q.is_done]
    total_dones = len(done_query_ids)
    return {
        "query_ids": query_ids,
        "total_queries": len(query_ids),
        "done_query_ids": done_query_ids,
        "total_dones": total_dones,
    }
    

