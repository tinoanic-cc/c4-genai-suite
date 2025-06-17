import os
import time
import sys

import requests

timeout = 60
base_url = os.getenv("TEST_REIS_URL", "http://localhost:3201")

if __name__ == "__main__":
    print(f"wait for {base_url} ", end="")
    for _ in range(timeout):
        print(".", end="")
        try:
            response = requests.get(f"{base_url}/health")
            if response.status_code == 200:
                # server started successfully, we can exit
                print(" success")
                sys.exit(0)
        except requests.exceptions.ConnectionError:
            time.sleep(1)

    print(" fail")
    sys.exit(1)
