from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class NoProjectFoundException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info=None) -> None:
        status_code = status.HTTP_404_NOT_FOUND
        detail = {
            "msg": "No project was found with this specification.",
            "more_info": more_info
        }
        super().__init__(status_code, detail, headers)


class ProjectNotFoundOrNotYoursException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info = None) -> None:
        status_code = status.HTTP_404_NOT_FOUND
        detail = {
            "msg": "This project was not found in your projects.",
            "more_info": more_info
        }
        super().__init__(status_code, detail, headers)


class ChangeStatusPermissionDeniedException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info = None) -> None:
        status_code = status.HTTP_403_FORBIDDEN
        detail = {
            "msg": f"You are not allowed to change the status of this project from {more_info['from']} to {more_info['next']}.",
        }
        super().__init__(status_code, detail, headers)

class QueryItemNotFoundException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info = None) -> None:
        status_code = status.HTTP_403_FORBIDDEN
        detail = {
            "msg": f"Query item not found.",
        }
        super().__init__(status_code, detail, headers)
