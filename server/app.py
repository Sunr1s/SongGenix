import random,uuid, pymongo,flask
from flask import jsonify
from pymongo import MongoClient
from turtle import title
from urllib import request
from flask import Flask, make_response, url_for, request,flash,session,redirect,abort
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_session import Session

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.SongGenix


@app.route('/createLobby', methods=["POST"])
def createLobby():
    if len(request.json['username']) > 2:
        lobby = {
            "admin":request.json['username'],
            "users": [],
            "settings": {}
        }
        post_id = db.Lobby.insert_one(lobby).inserted_id
        lobby["_id"] = str(post_id)
    return make_response(lobby, 200)

if __name__ == "__main__":
    app.run()