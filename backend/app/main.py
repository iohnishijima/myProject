from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from database import (create_all_data, list_data, check_user, create_user)
from botocore.exceptions import NoCredentialsError

app = FastAPI()


# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Reactアプリのオリジン
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageMetadata(BaseModel):
    url: str

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), loginUser: str = Form(...)):
    response = await create_all_data(files, loginUser)
    
@app.get("/files")
async def list_files():
    response = await list_data()
    return response

@app.get("/users")
async def read_files(name:str, password:str):
    print(name, password)
    response = await check_user(name, password)
    return response
    
# @app.post("/users")
# async def upload_user(name:str, password:str):
#     response = await create_user(name, password)