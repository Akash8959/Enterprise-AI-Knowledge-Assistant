from sqlalchemy import Column, Integer, String

from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    file_type = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    department = Column(
        String,
        default="General"
    )

    status = Column(
        String,
        default="Processed"
    )

    created_at = Column(
        String,
        nullable=True
    )