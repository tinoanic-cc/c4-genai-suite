from langchain_core.embeddings.embeddings import Embeddings

from rei_s.config import Config
from rei_s.services.store_adapter import StoreAdapter
from rei_s.services.stores.azure_ai_search import AzureAISearchStoreAdapter
from rei_s.services.stores.devnull_store import DevNullStoreAdapter
from rei_s.services.stores.pgvector import PGVectorStoreAdapter


def get_store(
    config: Config,
    embeddings: Embeddings,
    index_name: str | None,
) -> StoreAdapter:
    if config.store_type == "pgvector":
        return PGVectorStoreAdapter.create(config=config, embeddings=embeddings, index_name=index_name)
    elif config.store_type == "azure-ai-search":
        return AzureAISearchStoreAdapter.create(config=config, embeddings=embeddings, index_name=index_name)
    elif config.store_type == "dev-null":
        return DevNullStoreAdapter.create(config=config, embeddings=embeddings, index_name=index_name)
    else:
        raise ValueError(f"Store type {config.store_type} not supported")
