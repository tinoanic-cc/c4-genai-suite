from contextlib import contextmanager
import os


def noop():
    pass


@contextmanager
def env_value(key: str, value: str, apply=noop):
    previous_value = os.getenv(key)
    os.environ[key] = value
    apply()

    yield

    if previous_value is None:
        del os.environ[key]
    else:
        os.environ[key] = previous_value
    apply()
