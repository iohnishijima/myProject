from models import AllData, Users
import os
# mongoDB driver
import motor.motor_asyncio
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import FastAPI, HTTPException, UploadFile, File
import json

uri = os.getenv("MONGODB_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(uri)
database = client.YuIoPhotos
collection = database.alldata
user_collection = database.users

# AWS設定
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

async def create_all_data(files, loginUser):
    for file in files:
        try:
            # S3へのファイルアップロード
            s3_client.upload_fileobj(
                file.file,
                S3_BUCKET,
                file.filename,
                ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
            )
            file_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{file.filename}"
            name = file.filename
            user = loginUser

            # MongoDBにURLを保存
            all_data = AllData(url=file_url, user=user.strip("\""), name=name)
            all_data_dict = all_data.model_dump()
            result = await collection.insert_one(all_data_dict)
            print(result)
        except NoCredentialsError:
            raise HTTPException(status_code=500, detail="AWS credentials not found")
    return {"message": "Files uploaded successfully"}

async def list_data():
    try:
        # MongoDBから全データを取得
        mdt = []
        cursor = collection.find({})
        async for document in cursor:
            mdt.append(document)
        # S3からファイル一覧を取得
        s3_response = s3_client.list_objects_v2(Bucket=S3_BUCKET)
        s3_files = s3_response.get('Contents', [])
        # S3のファイル名とMongoDBのURLを照合
        file_data = []
        for file in s3_files:
            for data in mdt:
                if f"https://{S3_BUCKET}.s3.amazonaws.com/{file['Key']}" == data['url']:
                    file_data.append({
                        "img": data['url'],
                        "user": data['user'],
                        "title": data['name']
                    })

        return {"files": file_data}
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def check_user(name, password):
    try:
        # MongoDBから全データを取得
        mdt = []
        cursor = user_collection.find({})
        async for document in cursor:
            mdt.append(document)
            
        for data in mdt:
            if data['user'] == name and data['password'] == password:
                return data['user']
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def create_user(name, password):
    print("even_")
    try:
        print("came here")
        # MongoDBから全データを取得
        all_data = Users(user=name, password=password)
        all_data_dict = all_data.model_dump()
        print(all_data_dict)
        result = await user_collection.insert_one(all_data_dict)
        print(result)
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))