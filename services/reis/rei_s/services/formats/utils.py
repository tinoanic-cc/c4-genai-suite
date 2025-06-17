from io import BytesIO

from langchain_core.documents.base import Blob
from langchain_community.document_loaders.generic import BlobLoader

from rei_s.types.source_file import SourceFile


def check_file_name_extensions(file_name_extensions: list[str], file: SourceFile) -> bool:
    for ext in file_name_extensions:
        if file.file_name.lower().endswith(ext.lower()):
            return True

    return False


def validate_chunk_size(chunk_size: int | None, default: int) -> int:
    chunk_size = chunk_size if chunk_size is not None else default
    if chunk_size <= 0:
        raise ValueError("chunk_size needs to be >0")
    return chunk_size


def validate_chunk_overlap(chunk_overlap: int | None, default: int):
    chunk_overlap = chunk_overlap if chunk_overlap is not None else default
    if chunk_overlap < 0:
        raise ValueError("chunk_overlap needs to be >=0")
    return chunk_overlap


class BytesLoader(BlobLoader):
    def __init__(self, buffer: BytesIO):
        self.buffer = buffer

    def yield_blobs(self):
        yield Blob.from_data(self.buffer.getvalue(), path="stream")


class ProcessingError(Exception):
    def __init__(self, message: str, status: int):
        super().__init__(message)
        self.status = status
        self.message = message
