from typing import Dict
from fastapi.responses import JSONResponse
from starlette.background import BackgroundTask


class UserCreatedResponse(JSONResponse):
    def __init__(self, headers: Dict[str, str] | None = None, media_type: str | None = None, background: BackgroundTask | None = None) -> None:
        content: str = "User created successfully"
        status_code: int = 201,

        super().__init__(content, status_code, headers, media_type, background)
