from bson import ObjectId

def create_image_metadata(db, image_metadata):
    # 画像メタデータをMongoDBに挿入
    image_id = db.images.insert_one(image_metadata).inserted_id
    return str(image_id)

def get_image_metadata(db, image_id):
    # 指定されたIDで画像メタデータを検索
    return db.images.find_one({"_id": ObjectId(image_id)})

def update_image_metadata(db, image_id, updated_data):
    # 指定されたIDの画像メタデータを更新
    result = db.images.update_one({"_id": ObjectId(image_id)}, {"$set": updated_data})
    return result.modified_count

def delete_image_metadata(db, image_id):
    # 指定されたIDの画像メタデータを削除
    result = db.images.delete_one({"_id": ObjectId(image_id)})
    return result.deleted_count
