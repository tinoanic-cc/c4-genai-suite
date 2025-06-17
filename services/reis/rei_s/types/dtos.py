from typing import Any, List, Optional, Dict, Tuple
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel


class Identity(BaseModel):
    file_name: str = Field(description="The name of the file.")
    source_system: str = Field(description="The system that provided the source.")
    unique_path_or_id: Optional[str] = Field(None, description="The unique path or ID of the source.")
    link: Optional[str] = Field(None, description="A link to the source.")
    version: Optional[str] = Field(None, description="The version of the source.")
    mime_type: Optional[str] = Field(None, description="The MIME type of the source.")

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class SourceDto(BaseModel):
    title: str = Field(description="The title of the source.")
    identity: Identity = Field(description="The identity of the source.")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata about the source.")

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


SourceKey = Tuple[Optional[str], Optional[str], Optional[str], Optional[str], Optional[str]]


class ResultDocument(BaseModel):
    content: str = Field(description="the text content of the chunk")
    vector: list[float] | None = Field(description="the vector of the chunk", default=None)
    metadata: dict[str, Any] = Field(description="the metadata of the chunk")


class FileType(BaseModel):
    file_name_extension: str = Field(description="The file name extension.")


class FileTypesResult(BaseModel):
    items: list[FileType] = Field(description="The files types.")


class FileResult(BaseModel):
    files: list[ResultDocument] = Field(description="The Chunks which were found for the given query")
    debug: str = Field(
        description="Through this filed you can return Markdown which will be rendered in the frontend. You can "
        " return sources through that"
    )
    sources: list[SourceDto] = Field(description="Additional information about the sources.")


class FileProcessResult(BaseModel):
    chunks: list[ResultDocument] = Field(description="The chunks which constitute the processed file")


class UploadRequest(BaseModel):
    bucket: str = Field(description="The bucket where the file belongs too")
    index_name: str = Field(description="The index name")
    id: str = Field(description="The ID of the file")


class DocumentResponse(BaseModel):
    documents: List[str]
