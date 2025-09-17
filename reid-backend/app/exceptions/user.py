from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class NoUserFoundException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info=None) -> None:
        status_code = status.HTTP_404_NOT_FOUND
        detail = {
            "msg": f"User with `{more_info['username']}` as username was not found."}
        super().__init__(status_code, detail, headers)


class IncorrectUserNameOrPasswordException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_406_NOT_ACCEPTABLE
        detail = {"msg": "The username or password is incorrect."}
        super().__init__(status_code, detail, headers)


class UserExistException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "This username cannot be selected."}
        super().__init__(status_code, detail, headers)


class AdminExistException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_406_NOT_ACCEPTABLE
        detail = {"msg": "Admin exist for this application"}
        super().__init__(status_code, detail, headers)


class UnauthorizedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "Could not validate credentials, login again."}
        super().__init__(status_code, detail, headers)


class CreateUserPermissionDeniedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "You don`t have permission to create user, only admins can create user."}
        super().__init__(status_code, detail, headers)


class DeleteUserPermissionDeniedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "You don`t have permission to delete user, only admins can delete user"}
        super().__init__(status_code, detail, headers)


class GetAllUserPermissionDeniedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "You don`t have permission to get all user, only admins can get users"}
        super().__init__(status_code, detail, headers)

class CreateProjectPermissionDeniedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": "You don`t have permission to upload project, only admins can get users"}
        super().__init__(status_code, detail, headers)



class InvalidUserRoleException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info = None) -> None:
        status_code = status.HTTP_400_BAD_REQUEST
        detail = {"msg": f"This role `{more_info['role']}` is not valid for user."}
        super().__init__(status_code, detail, headers)
