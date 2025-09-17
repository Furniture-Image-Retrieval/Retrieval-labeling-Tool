from pydantic import BaseModel
from typing import List, Optional

class QueryItemDetail(BaseModel):
    project_name: str
    id: int
    master_id: int
    start: Optional[float] = None
    preview: str
    video: str
    top_gallery_items: List
    selected_items: List
    is_done: bool