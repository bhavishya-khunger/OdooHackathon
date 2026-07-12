import json
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator


class CategoryFieldDefinition(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    type: str = Field(pattern=r"^(string|number|date|boolean)$")
    required: bool = False
    label: Optional[str] = Field(default=None, max_length=100)


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    fields: list[CategoryFieldDefinition] = Field(default_factory=list)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    fields: Optional[list[CategoryFieldDefinition]] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    fields: list[CategoryFieldDefinition]
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("fields", mode="before")
    @classmethod
    def parse_fields(cls, value: Any) -> list:
        if value is None or value == "":
            return []
        if isinstance(value, str):
            return json.loads(value)
        return value


def serialize_category_fields(fields: list[CategoryFieldDefinition]) -> str:
    return json.dumps([field.model_dump() for field in fields])
