# see also: https://stackoverflow.com/a/78108408

import http
import http.server
import threading

import prometheus_client


class PrometheusHttpServer:
    def __init__(self, port):
        self.port = port
        self.httpd = None
        self.thread = None

    def start(self):
        self.httpd = http.server.HTTPServer(("0.0.0.0", self.port), prometheus_client.exposition.MetricsHandler)
        self.thread = threading.Thread(target=self.httpd.serve_forever)
        self.thread.daemon = True
        self.thread.start()

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()
            self.httpd = None
        if self.thread:
            self.thread.join()
            self.thread = None
