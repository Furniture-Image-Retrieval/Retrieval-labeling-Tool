from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from datetime import datetime
from typing import Optional, List
from fastapi import Header

from app.models.token import Token
from app.models.project import Project
from app.services import user as user_service
from app.services import project as project_service
from app.models.user import User, CreateUserScheme, LoginUserScheme, UserResponseScheme, DeleteUserScheme
from app.exceptions.user import \
    UserExistException,\
    AdminExistException,\
    NoUserFoundException,\
    UnauthorizedException,\
    InvalidUserRoleException,\
    CreateUserPermissionDeniedException,\
    GetAllUserPermissionDeniedException,\
    DeleteUserPermissionDeniedException,\
    IncorrectUserNameOrPasswordException

from app.enums import USER_ROLE, PROJECT_STATUS

router = APIRouter()


@router.post("/create-admin", response_model=Token, description="Only one admin can exist in the same time")
async def create_admin(user_data: CreateUserScheme):

    user = await user_service.find_one({"role": USER_ROLE.ADMIN.value})
    if user:
        raise AdminExistException()

    user = User(
        role=USER_ROLE.ADMIN.value,
        username=user_data.username,
        hashed_password=user_service.hash(user_data.password),
        last_login=datetime.now()
    )
    token = user_service.create_token(user_data.username)
    await user_service.inser_one(user)

    return token


@router.post("/create")
async def create_user(user_data: CreateUserScheme, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)
    if user.role != USER_ROLE.ADMIN:
        raise CreateUserPermissionDeniedException()

    user = await user_service.find_one({"username": user_data.username})

    if user:
        raise UserExistException()

    user = User(
        role=user_data.role.value,
        username=user_data.username,
        hashed_password=user_service.hash(user_data.password),
        last_login=datetime.now()
    )
    await user_service.inser_one(user)

    return JSONResponse(content="User created successfully", status_code=201)


@router.post("/login", response_model=Token)
async def login_for_access_token(user_data: LoginUserScheme):
    user = await user_service.authenticate_user(user_data.username, user_data.password)
    if not user:
        raise IncorrectUserNameOrPasswordException()

    token = user_service.create_token(user.username)
    await user_service.update_last_login(user.username)

    return token


@router.post("/me", response_model=UserResponseScheme)
async def get_current_user(token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = UserResponseScheme(**user)
    projects = await project_service.find_all({f"{user.role}": user.username})
    if projects: 
        projects = [prj for prj in projects if prj['status'] != PROJECT_STATUS.ARCHIVE.value]
        user.num_active_projects = len(projects)
    return user


@router.delete("/delete", response_model=UserResponseScheme)
async def delete_user(target_user_info: DeleteUserScheme, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)

    if user.role != USER_ROLE.ADMIN:
        raise DeleteUserPermissionDeniedException()

    target_user = await user_service.find_one(detail={"username": target_user_info.username})
    if target_user is None:
        raise NoUserFoundException(more_info={"username": target_user_info.username})
    target_user = User(**target_user)

    projects = await project_service.find_all(detail={f"{target_user.role.value}": target_user_info.username})
    not_allowed_list: List[Project] = []
    for prj in projects:
        project = Project(**prj)
        if project.status == PROJECT_STATUS.ARCHIVE:
            await project_service.assign_one(
                name=project.name, status=project.status, role=target_user.role.value, username=None)
        else:
            not_allowed_list.append(project)
    if not_allowed_list:
        raise HTTPException(
            status_code=406, detail=f"User take a part in these projects as {target_user.role.value}: {[prj.name for prj in not_allowed_list]}")

    await user_service.delete_one(username=target_user.username)
    return JSONResponse(content=f"User with username `{target_user.username}` deleted successfully.", status_code=200)


@router.get("/", response_model=List[UserResponseScheme], description="Get all useres based on role")
async def get_all_users(role: Optional[str] = None, token: Optional[str] = Header(None)):
    username = user_service.decode_token(access_token=token)
    if username is None:
        raise UnauthorizedException()

    user = await user_service.find_one({"username": username})
    user = User(**user)
    if user.role != USER_ROLE.ADMIN:
        raise GetAllUserPermissionDeniedException()

    if role not in USER_ROLE and role is not None:
        raise InvalidUserRoleException(more_info={'role': role.value})

    if role is None:
        target_users = await user_service.find_all()
    else:
        target_users = await user_service.find_all(detail={'role': role})

    users = [UserResponseScheme(**target_user) for target_user in target_users]
    for user in users:
        projects = await project_service.find_all({f"{user.role}": user.username})
        if projects:
            projects = [prj for prj in projects if prj['status'] != PROJECT_STATUS.ARCHIVE.value]
            user.num_active_projects = len(projects)
    return users
