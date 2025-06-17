from prometheus_client import Counter

files_processed_counter = Counter("files_processed_total", "Number of files that have been processed.")

files_added_to_queue = Counter("files_added_to_queue_total", "Number of files that have been processed.")
