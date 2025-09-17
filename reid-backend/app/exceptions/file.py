from typing import Any, Dict, Optional
from fastapi import HTTPException, status

class NotValidJsonFileException(HTTPException):
    def __init__(self, headers: Dict[str, str] | None = None, more_info = None) -> None:
        status_code = status.HTTP_403_FORBIDDEN
        detail = {
            "msg": f"Not a valid json file.",
        }
        super().__init__(status_code, detail, headers)
