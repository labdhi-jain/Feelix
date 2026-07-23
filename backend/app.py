import os
import bcrypt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import init_db, create_user, get_user, save_emotion, get_emotions
from emotion import detect_emotion
from spotify import get_auth_url, get_token
import spotipy
from typing import Optional

# Initialize database
init_db()

app = FastAPI(title="Feelix API", description="Emotion detection and Spotify playback backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class DetectRequest(BaseModel):
    image: str
    user_id: int

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class PlayMusicRequest(BaseModel):
    emotion: str
    token: str

@app.get("/")
def home():
    return {"message": "Feelix FastAPI Backend Running"}

@app.post("/detect")
def detect(data: DetectRequest):
    try:
        emotion = detect_emotion(data.image)
        save_emotion(data.user_id, emotion)
        return {"emotion": emotion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics")
def analytics():
    emotions = get_emotions()
    return {"data": emotions}

@app.post("/register")
def register(data: RegisterRequest):
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt())
    try:
        create_user(data.username, hashed)
        return {"message": "User registered"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="User already exists")

@app.post("/login")
def login(data: LoginRequest):
    user = get_user(data.username)
    if user and bcrypt.checkpw(data.password.encode(), user[2]):
        return {
            "message": "Login successful",
            "user_id": user[0]
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/spotify/login")
def spotify_login():
    url = get_auth_url()
    return {"url": url}

@app.get("/spotify/callback")
def spotify_callback(code: str):
    token = get_token(code)
    return token

emotion_playlists = {
    "happy": "37i9dQZF1DXdPec7aLTmlC",
    "sad": "37i9dQZF1DX7qK8ma5wgG1",
    "angry": "37i9dQZF1DWYxwmBaMqxsl",
    "neutral": "37i9dQZF1DX4WYpdgoIcn6"
}

@app.post("/spotify/play")
def play_music(data: PlayMusicRequest):
    sp = spotipy.Spotify(auth=data.token)
    try:
        devices = sp.devices()
        if not devices.get("devices"):
            raise HTTPException(status_code=400, detail="No active Spotify device found. Open Spotify app.")
        
        device_id = devices["devices"][0]["id"]
        playlist_id = emotion_playlists.get(data.emotion)

        if playlist_id:
            sp.start_playback(
                device_id=device_id,
                context_uri=f"spotify:playlist:{playlist_id}"
            )
            return {"message": "Playing music"}
        else:
            raise HTTPException(status_code=404, detail="No playlist found for this emotion")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, reload=True)