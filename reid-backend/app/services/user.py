from jose import jwt
from typing import Dict, List
from datetime import datetime, timedelta

from app.core.db import session
from app.models.user import User
from app.models.token import Token
from app.core.oauth import pwd_context
from app.core.oauth import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES


async def find_one(detail: Dict):
    user = await session.db.users.find_one(detail)
    return user


async def find_all(detail: Dict[str, str] = None) -> List:
    users = await session.db.users.find(detail).to_list(length=None)
    return users


async def inser_one(user: User):
    user_data = user.model_dump()
    await session.db.users.insert_one(user_data)


async def delete_one(username: str):
    result = await session.db.users.delete_one({"username": username})
    return result

async def update_last_login(username: str):
    await session.db.users.update_one({"username": username}, {"$set": {"last_login": datetime.now()}})


async def authenticate_user(username: str, password: str) -> User:
    user_data = await find_one({"username": username})
    if not user_data:
        return False
    user = User(**user_data)
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_token(username: str) -> Token:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )

    token = Token(
        access_token=access_token,
        token_type="bearer"
    )
    return token


def decode_token(access_token: str) -> str:
    payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    return username


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
