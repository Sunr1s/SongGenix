from bson.objectid import ObjectId
from urllib import request
from pymongo import MongoClient
from flask import Flask, make_response, request
import spotipy
from spotipy.oauth2 import SpotifyOAuth

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
    return make_response(result, 200)

@app.route('/updateRoom/<id>', methods=['PUT'])
def updateRoom(id):
    filter = { '_id': ObjectId(id) }
    match list(request.get_json().keys())[0]:
        case 'users': 
            settings = { "$set":{ "users": request.json['users']}}
        case 'settings': 
            settings = { "$set":{ "settings": request.json}}
        case _ : 
            return make_response("bad args", 500)
    db.Lobby.update_one(filter, settings)
    return make_response("ok", 200)

@app.route('/')
def one():
    get_playlist()
    return "hey"

def get_playlist():
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="62cac1f286d94cf08b9cb1c29ab09f67",
                                                            client_secret="a9718725dd8142cea7e7dbea4fdeae4d"),
                                                            redirect_uri="http://127.0.0.1:5000/",
                                                            scope="user-library-read")

    results = sp.search(q='weezer', limit=20)
    results = sp.current_user_playlists(limit=50)
    for i, item in enumerate(results['items']):
        print("%d %s" % (i, item['name']))
    
if __name__ == "__main__":
    app.run()
    