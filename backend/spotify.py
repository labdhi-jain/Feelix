import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

def get_sp_oauth():
    load_dotenv(override=True)
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI", "http://127.0.0.1:3000/callback")
    
    return SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope="user-read-playback-state user-modify-playback-state streaming",
        cache_path=None,
        show_dialog=True
    )

def get_auth_url():
    sp_oauth = get_sp_oauth()
    return sp_oauth.get_authorize_url()

def get_token(code):
    sp_oauth = get_sp_oauth()
    token_info = sp_oauth.get_access_token(code)
    if isinstance(token_info, dict) and "access_token" in token_info:
        return token_info["access_token"]
    return token_info