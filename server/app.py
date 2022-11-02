from bson.objectid import ObjectId
from urllib import request
from pymongo import MongoClient
from flask import Flask, make_response, request

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client.SongGenix

@app.route('/createLobby', methods=["POST"])
def createLobby():
    if len(request.json['username']) > 2:
        lobby = {
            "admin": request.json['username'],
            "users": [],
            "settings": {}
        }
        post_id = db.Lobby.insert_one(lobby).inserted_id
        lobby["_id"] = str(post_id)
    return make_response(lobby, 200)

@app.route('/deleteRoom/<id>', methods=['DELETE'])
def deleteRoom(id):
    result = db.Lobby.delete_one({'_id': ObjectId(id)})
    return make_response("ok", 200)

if __name__ == "__main__":
    app.run()