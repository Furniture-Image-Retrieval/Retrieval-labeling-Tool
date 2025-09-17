from enum import Enum
from datetime import datetime
from pydantic import BaseModel
from app.enums import USER_ROLE


class User(BaseModel):
    role: USER_ROLE
    username: str
    disabled: bool = False
    hashed_password: str | None
    last_login: datetime


class UserResponseScheme(BaseModel):
    role: str
    username: str
    num_active_projects: int = 0 

class CreateUserScheme(BaseModel):
    username: str
    password: str
    role: USER_ROLE


class LoginUserScheme(BaseModel):
    username: str
    password: str

class DeleteUserScheme(BaseModel):
    username: str
