from spotipy.oauth2 import SpotifyOAuth
from flask import url_for, session
import time

def create_spotify_oauth():
    return SpotifyOAuth(
            client_id="62cac1f286d94cf08b9cb1c29ab09f67",
            client_secret="a9718725dd8142cea7e7dbea4fdeae4d",
            redirect_uri=url_for('redirectSpotify', _external=True),
            scope="playlist-read-private")

def get_token():
    token_valid = False
    token_info = session.get("token_info", {})

    # Checking if the session already has a token stored
    if not (session.get('token_info', False)):
        token_valid = False
        return token_info, token_valid

    # Checking if token has expired
    now = int(time.time())
    is_token_expired = session.get('token_info').get('expires_at') - now < 60

    # Refreshing token if it has expired
    if (is_token_expired):
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(session.get('token_info').get('refresh_token'))

    token_valid = True
    return token_info, token_valid