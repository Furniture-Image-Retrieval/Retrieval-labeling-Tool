backend:

- pip install fastapi
- pip install python-jose
- pip install motor
- pip install bcrypt==4.0.1
....

it will run, no need for python version change
uvicorn app.main:app --reload

------
front:
docker build -t reid-frontend .
docker run -p 3000:3000 reid-frontend

-----
mongodb:
http://localhost:27017/
docker compose up

directly in db:
docker exec -it mongodb mongosh -u your_username -p your_password --authenticationDatabase admin

mongo express:
your_username
your_password
http://localhost:8081/

there is no sql hers ->
test> use reid
switched to db reid
reid> show collections
test
