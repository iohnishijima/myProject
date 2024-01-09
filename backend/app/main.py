from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import crud
from database import db
import boto3
from botocore.exceptions import NoCredentialsError
import os
from fastapi.middleware.cors import CORSMiddleware

# AWS設定
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Reactアプリのオリジン
    allow_origins=["*"],  # Reactアプリのオリジン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageMetadata(BaseModel):
    url: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # S3へのファイルアップロード
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET,
            file.filename,
            ExtraArgs={"ACL": "public-read"}
        )
        file_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{file.filename}"

        # MongoDBにURLを保存
        image_metadata = {"url": file_url}
        image_id = crud.create_image_metadata(db, image_metadata)
        return {"image_id": image_id, "file_url": file_url}
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")


@app.get("/images/{image_id}")
async def get_image(image_id: str):
    image_metadata = crud.get_image_metadata(db, image_id)
    if image_metadata is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return image_metadata

@app.put("/images/{image_id}")
async def update_image(image_id: str, image_metadata: ImageMetadata):
    modified_count = crud.update_image_metadata(db, image_id, image_metadata.dict())
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image updated successfully"}

@app.delete("/delete/{file_name}")
async def delete_file(file_name: str):
    try:
        # S3からファイルを削除
        s3_client.delete_object(Bucket=S3_BUCKET, Key=file_name)

        # S3からの削除後、MongoDBのレコードも削除
        deleted_count = crud.delete_image_metadata_by_url(db, f"https://{S3_BUCKET}.s3.amazonaws.com/{file_name}")
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="MongoDBのレコードが見つかりませんでした")


        return {"message": "ファイルが削除されました"}
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/files")
async def list_files():
    try:
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET)
        files = response.get('Contents', [])

        file_names = [file['Key'] for file in files]
        return {"files": file_names}
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))