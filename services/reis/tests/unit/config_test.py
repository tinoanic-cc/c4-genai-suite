import os
from unittest import mock
import pytest

from rei_s.config import Config


@pytest.fixture
def empty_env():
    with mock.patch.dict(os.environ, clear=True):
        yield


@pytest.mark.parametrize(
    "env_file,defined,undefined",
    [
        (
            "tests/data/env_vectorstore_only_pgvector.env",
            ["store_pgvector_url"],
            ["store_azure_ai_search_service_endpoint"],
        ),
        (
            "tests/data/env_vectorstore_only_aisearch.env",
            ["store_azure_ai_search_service_endpoint"],
            ["store_pgvector_url"],
        ),
        (
            "tests/data/env_embeddings_only_azure.env",
            ["embeddings_azure_openai_endpoint"],
            ["embeddings_openai_model_name"],
        ),
        (
            "tests/data/env_embeddings_only_openai.env",
            ["embeddings_openai_model_name"],
            ["embeddings_azure_openai_endpoint"],
        ),
        (
            "tests/data/env_empty_stt_type.env",
            ["store_type"],
            ["stt_type"],  # empty string should be handled as undefined
        ),
    ],
)
def test_env(empty_env, env_file, defined, undefined):
    settings = Config(_env_file=env_file, _env_file_encoding="utf-8")

    for name in undefined:
        assert getattr(settings, name) is None
    for name in defined:
        assert getattr(settings, name) is not None


@pytest.mark.parametrize(
    "env_file,expected_missing",
    [
        ("tests/data/env_vectorstore_missing_pgvector_url.env", ["STORE_PGVECTOR_URL"]),
        ("tests/data/env_vectorstore_missing_aisearch_endpoint.env", ["STORE_AZURE_AI_SEARCH_SERVICE_ENDPOINT"]),
        ("tests/data/env_vectorstore_missing_aisearch_key.env", ["STORE_AZURE_AI_SEARCH_SERVICE_API_KEY"]),
        ("tests/data/env_embeddings_missing_azure_deployment.env", ["EMBEDDINGS_AZURE_OPENAI_DEPLOYMENT_NAME"]),
        ("tests/data/env_embeddings_missing_openai_model.env", ["EMBEDDINGS_OPENAI_MODEL_NAME"]),
    ],
)
def test_env_missing(empty_env, env_file, expected_missing):
    with pytest.raises(Exception) as exc_info:
        Config(_env_file=env_file, _env_file_encoding="utf-8")

    error_msgs = {i["msg"] for i in exc_info.value.errors()}

    for err_msg in error_msgs:
        assert any(expected in err_msg for expected in expected_missing)


@pytest.mark.parametrize(
    "env_file",
    [
        ("tests/data/env_wrong_embedding_type.env"),
        ("tests/data/env_wrong_store_type.env"),
    ],
)
def test_env_wrong(empty_env, env_file):
    with pytest.raises(Exception) as exc_info:
        Config(_env_file=env_file, _env_file_encoding="utf-8")

    assert len(exc_info.value.errors()) == 1

    err_msg = exc_info.value.errors()[0]["msg"]
    assert err_msg.startswith("Input should be")
