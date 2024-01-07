from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import crud
from database import db


app = FastAPI()

class ImageMetadata(BaseModel):
    # ここに画像メタデータのスキーマを定義
    pass

@app.post("/images/")
async def upload_image(image_metadata: ImageMetadata):
    image_id = crud.create_image_metadata(db, image_metadata.dict())
    return {"image_id": image_id}

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

@app.delete("/images/{image_id}")
async def delete_image(image_id: str):
    deleted_count = crud.delete_image_metadata(db, image_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}
