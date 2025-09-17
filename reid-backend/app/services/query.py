from app.core.db import session
from typing import Dict, List
from app.services import user as user_service
from app.models.query_item import QueryItemDetail


async def insert_one(query: QueryItemDetail) -> None:
    query_data = query.dict()

    # Save the project data to the database
    result = await session.db.queries.insert_one(query_data)
    return result 


async def find_all(detail: Dict[str, str]) -> List:
    queries = await session.db.queries.find(detail).to_list(length=None)
    return queries

async def find_one(detail: Dict) -> Dict:
    query_data = await session.db.queries.find_one(detail)
    return query_data

async def update_query(project_name, master_id, data: Dict) -> Dict:
    filter_ = {"project_name": project_name, "master_id": master_id}
    result = await session.db.queries.update_one(filter_, {"$set": data}, upsert=True)
    return result