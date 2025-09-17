from app.core.db import session
from typing import Dict, List
from app.services import user as user_service
from app.models.project import Project


async def insert_one(project: Project) -> None:
    project_data = project.dict()

    # Save the project data to the database
    result = await session.db.projects.insert_one(project_data)
    return result 


async def find_all(detail: Dict[str, str]) -> List:
    projects = await session.db.projects.find(detail).to_list(length=None)
    return projects


async def find_one(detail: Dict) -> Dict:
    project_data = await session.db.projects.find_one(detail)
    return project_data


async def assign_one(name: str, status, role, username):
    data = {
        f"{role}": f"{username}",
        "status": f"{status}"}

    filter_ = {"name": name}
    await session.db.projects.update_one(filter_, {"$set": data}, upsert=True)


async def change_status(name: str, new_status: str):
    data = {
        "status": f"{new_status}"}

    filter_ = {"name": name}
    await session.db.projects.update_one(filter_, {"$set": data}, upsert=True)


async def clear_reviewer_annotator(name: str):
    data = {
        "reviewer": None,
        "annotator": None}

    filter_ = {"name": name}
    await session.db.projects.update_one(filter_, {"$set": data}, upsert=True)
