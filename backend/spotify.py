import spotipy
from spotipy.oauth2 import SpotifyOAuth

CLIENT_ID = "a0a9a949c34c487e8be992140134426c"
CLIENT_SECRET = "cd4533d637ec4af5be7a939136a0d349"
REDIRECT_URI = "http://127.0.0.1:3000/callback"

sp_oauth = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="user-read-playback-state user-modify-playback-state streaming",
    cache_path=None
)

def get_auth_url():
    return sp_oauth.get_authorize_url()

def get_token(code):
    token_info = sp_oauth.get_access_token(code)
    return token_info["access_token"]