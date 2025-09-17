from pydantic import BaseModel

class GalleryItemDetail(BaseModel):
    id: int
    master_id: int
    start: float
    score: float
    preview: str
    video: str