from pydantic import BaseModel, EmailStr


from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    department: Optional[str] = "General"
    role: Optional[str] = "user"

    class Config:
        from_attributes = True