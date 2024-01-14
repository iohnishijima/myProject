from pydantic import BaseModel

class AllData(BaseModel):
  url: str
  user: str
  name: str
  
class Users(BaseModel):
  user: str
  password: str