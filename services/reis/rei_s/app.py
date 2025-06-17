from rei_s.app_factory import create
from rei_s.config import get_config

get_config()  # before starting we check whether the config values are invalid
app = create()
