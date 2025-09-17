
# Reid Backend

A brief description of what this project does and who it's for


## Run Locally

Clone the project

```bash
  git clone https://github.com/mj-haghighi/reid-backend
```

Go to the project directory

```bash
  cd reid-backend
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Put `docker-compose.yml` & `.env` in project directory.

Start **MongoDB** & **Mongo Express**

```bash
  docker-compose -d up .
```


Start the server

```bash
  uvicorn app.main:app --reload
```


## Features

- Create Admin `user/create-admin`
- Create user `/user/create`
- Loggin `/user/login`
- Get current user `/user/me`
- Static files `/statics/`


## Tech Stack

**Server:** Fastapi, Uvicorn

**DB:** MongoDB

