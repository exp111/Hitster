from http.server import HTTPServer, BaseHTTPRequestHandler 
from http.server import SimpleHTTPRequestHandler
import ssl

httpd = HTTPServer(("0.0.0.0", 4443), SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    keyfile="key.pem",
    certfile="cert.pem",
    server_side=True)
httpd.serve_forever()