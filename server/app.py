import spotipy, json
from bson import ObjectId, json_util
from urllib import request
from pymongo import MongoClient
from flask import Flask, make_response, request, session, redirect
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from sp_loggin import get_token, create_spotify_oauth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = MongoClient('localhost', 27017)
db = client.SongGenix

app.secret_key = 'SOMETHING-RANDOM'
app.config['SESSION_COOKIE_NAME'] = 'spotify-login-session'

"""lobby creating
Returns:
    json: room, 200
"""

@app.route('/createRoom', methods=["POST"])
def createLobby():
    try:
        if len(request.json['username']) > 2:
            lobby = {
                "admin": request.json['username'],
                "users": [],
                "settings": {}
            }
            post_id = db.Lobby.insert_one(lobby).inserted_id
            lobby["_id"] = str(post_id)
            return make_response(lobby, 200)
        return make_response({ 'msg': 'Invalid data' }, 400)
    except:
        return make_response({ 'msg': 'Server error' }, 500)

    """reading room
    Recive:
        str: room id
    Return:
        json: room
    """

@app.route('/readRoom/<room_id>', methods=["GET"])
def readRoom(room_id):
    try:
        room = db.Lobby.find_one({'_id':ObjectId(room_id)})
        return make_response(json.loads(json_util.dumps(room)), 200)
    except:
        return make_response('room not found', 404)

    """deleting room
    Recive:
        str: room id
    Returns:
        json: result code
    """

@app.route('/deleteRoom/<id>', methods=['DELETE'])
def deleteRoom(id):
    result = db.Lobby.delete_one({'_id': ObjectId(id)})
    return make_response(result, 200)

    """updating room
    Recive:
        str: room id
    Returns:
        json: ok
    """

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

    """get top autor traks
    Recive:
        str: autor name
        int: count traks to parse
    Returns:
        json: traks, 200
        error: 'No such autor', 400
    """

@app.route('/getbyautor/<name>/<int:trakscount>', methods=["GET"])
def get_byautor(name,trakscount):
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="62cac1f286d94cf08b9cb1c29ab09f67",
                                                            client_secret="a9718725dd8142cea7e7dbea4fdeae4d"))
    autor = []
    results = sp.search(q='artist:' + name, type='artist')
    items = results['artists']['items']
    if len(items) > 0:
        artist = items[0]
        results = sp.artist_top_tracks(artist["uri"])
        for track in results['tracks'][:trakscount]:
            autor.append({
                "track": track['name'],
                'audio': track['preview_url'],
                'cover art': track['album']['images'][0]['url']
            })

        print(type(autor))
        return make_response(autor, 200)
    else:
        return make_response('No such autor', '400')

    """Spotify loggin
    Returns:
        json: logged, 200
    """

@app.route('/loginSpotify', methods=['GET'])
def loginSpotify():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    print(auth_url)
    return redirect(auth_url)

@app.route('/redirectSpotify', methods=['GET'])
def redirectSpotify():
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info
    return redirect('/')

    """logout spotify

    Returns:
        redirect: '/'
    """

@app.route('/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect('/')

    """Get users playlist
    Recive:
        str: playlistname
    Returns:
        sting: ok, 200
        error: 'Unauthorized', 401
    """

@app.route('/getbyplaylist/<playlistname>', methods=['GET'])
def getbyplaylist(playlistname):
    traks = []
    session['token_info'], authorized = get_token()
    session.modified = True
    if not authorized:
        return make_response('Unauthorized', '401')

    sp = spotipy.Spotify(auth=session.get('token_info').get('access_token'))

    results = sp.current_user_playlists(limit=50)
    for item in results['items']:
        if str(item['name']) == playlistname:
            traks.append(sp.playlist(item['uri'])['tracks']['items'])
    if db.Lobby.find_one({"admin":request.json['name']}):
        db.Lobby.find_one_and_update(
            {"_id":ObjectId(request.json['id'])},
            {'$set': {"playlist":traks}})
        return make_response('tracks written', '200')
    else:
        return make_response('forbidden ', '403')
    
    
if __name__ == "__main__":
    app.run()
    