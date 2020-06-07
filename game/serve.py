# serve.py

from flask import Flask
from flask import render_template
import socket

host_name = socket.gethostbyname(socket.gethostname())

# creates a Flask application, named app
app = Flask(__name__, static_folder="", template_folder="")
app.config["CACHE_TYPE"] = "null"

# a route where we will display a welcome message via an HTML template
@app.route("/")
def main():
    return render_template("./index.html")

# run the application
if __name__ == "__main__":
    app.run(host=host_name)