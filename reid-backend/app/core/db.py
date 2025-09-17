import os
from motor.motor_asyncio import AsyncIOMotorClient


class Database:
    def __init__(self, uri: str, db_name: str, username: str, password: str):
        self.client = AsyncIOMotorClient(
            uri, username=username, password=password)
        self.db = self.client[db_name]

    async def close(self):
        self.client.close()

    def get_collection(self, collection_name: str):
        return self.db[collection_name]


session = Database(
    os.environ['MONGODB_HOST'],
    os.environ['MONGODB_DBNAME'],
    os.environ['MONGODB_USERNAME'],
    os.environ['MONGODB_PASSWORD'])
