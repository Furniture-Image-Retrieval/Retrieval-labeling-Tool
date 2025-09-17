from pydantic import BaseModel
from app.enums import PROJECT_STATUS, USER_ROLE
from typing import List

class Project(BaseModel):
    name: str
    annotator: str | None
    reviewer: str | None
    status: PROJECT_STATUS

class ProjectResponseScheme(BaseModel):
    name: str
    annotator: str | None
    reviewer: str | None
    status: PROJECT_STATUS

class ProjectAssignScheme(BaseModel):
    project_name: str
    username: str
    role: USER_ROLE

class ChangeStatusScheme(BaseModel):
    project_name: str
    new_status: PROJECT_STATUS