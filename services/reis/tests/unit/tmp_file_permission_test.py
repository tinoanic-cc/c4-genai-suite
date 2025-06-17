import pytest

from fastapi.testclient import TestClient
from langchain_community.embeddings import FakeEmbeddings
from rei_s.config import update_tempdir
from rei_s.services.stores.devnull_store import DevNullStoreAdapter
from tests.unit.utils import env_value


@pytest.fixture
def use_unknown_tmp_dir():
    with env_value("TMP_FILES_ROOT", "/unknown", update_tempdir):
        yield


@pytest.fixture
def use_tmp_dir():
    with env_value("TMP_FILES_ROOT", "/tmp", update_tempdir):
        yield


def test_add_files_write(mocker, app, use_tmp_dir):
    # mock embeddings to avoid calls to azure
    mocker.patch("rei_s.services.embeddings_provider.get_embeddings", return_value=FakeEmbeddings(size=1352))
    # mock store to avoid calls to the db
    mocker.patch("rei_s.services.store_service.get_vector_store", return_value=DevNullStoreAdapter())

    with TestClient(app) as client:
        with open("tests/data/birthdays.pptx", "rb") as f:
            response = client.post(
                "/files",
                data=f,
                headers={
                    "bucket": "15",
                    "id": "1",
                    "fileName": "test.pptx",
                    "fileMimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                },
            )
        assert response.status_code == 200


def test_add_files_read_only(mocker, app, use_unknown_tmp_dir):
    # mock embeddings to avoid calls to azure
    mocker.patch("rei_s.services.embeddings_provider.get_embeddings", return_value=FakeEmbeddings(size=1352))
    # mock store to avoid calls to the db
    mocker.patch("rei_s.services.store_service.get_vector_store", return_value=DevNullStoreAdapter())

    with TestClient(app, raise_server_exceptions=False) as client:
        with open("tests/data/birthdays.pptx", "rb") as f:
            response = client.post(
                "/files",
                data=f,
                headers={
                    "bucket": "15",
                    "id": "1",
                    "fileName": "test.pptx",
                    "fileMimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                },
            )
        assert response.status_code == 500
