'''To run on all addresses RUN: flask run --host=0.0.0.0'''

from flask import Flask, render_template, request
from flask_socketio import SocketIO, rooms, send, join_room, leave_room
from engineio.payload import Payload
import os

Payload.max_decode_packets = 500  # handle the overloading of packets

app = Flask(__name__)
app.secret_key = os.environ.get('SecretKey')

# Initialize SocetIO
socketio = SocketIO(
    app,
    cors_allowed_origins=[
        'http://192.168.4.32:5000',
        'http://localhost:5000'
    ]
)

ROOMS = [
    "News",
    "Gaming",
    "Coding",
    "Fun"
]

clients = []

@app.route("/")
def home():
    return render_template("index.html", rooms=ROOMS)

@socketio.on("connect")
def connect():
    sid = request.sid
    clients.append(sid)

if __name__ == "__main__":
    socketio.run(app, debug=True)
