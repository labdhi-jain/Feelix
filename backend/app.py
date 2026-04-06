from flask_cors import CORS
import bcrypt
from database import create_user, get_user
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
from emotion import detect_emotion
from database import init_db, save_emotion, get_emotions
from spotify import get_auth_url, get_token
import spotipy

init_db()

app = Flask(__name__)
CORS(app)
@app.route("/detect", methods=["POST"])
def detect():
    data = request.json

    image = data["image"]
    user_id = data["user_id"]

    emotion = detect_emotion(image)

    save_emotion(user_id, emotion)

    return jsonify({"emotion": emotion})


@app.route("/analytics", methods=["GET"])
def analytics():
    emotions = get_emotions()
    return jsonify({"data": emotions})

@app.route("/register", methods=["POST"])
def register():
    data = request.json

    username = data["username"]
    password = data["password"]

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    try:
        create_user(username, hashed)
        return jsonify({"message": "User registered"})
    except:
        return jsonify({"error": "User already exists"}), 400


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data["username"]
    password = data["password"]

    user = get_user(username)

    if user and bcrypt.checkpw(password.encode(), user[2]):
        return jsonify({
            "message": "Login successful",
            "user_id": user[0]
        })

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/")
def home():
    return jsonify({"message": "Feelix Backend Running"})

@app.route("/spotify/login")
def spotify_login():
    url = get_auth_url()
    return jsonify({"url": url})

@app.route("/spotify/callback")
def spotify_callback():
    code = request.args.get("code")
    token = get_token(code)
    return jsonify(token)

emotion_playlists = {
    "happy": "37i9dQZF1DXdPec7aLTmlC",
    "sad": "37i9dQZF1DX7qK8ma5wgG1",
    "angry": "37i9dQZF1DWYxwmBaMqxsl",
    "neutral": "37i9dQZF1DX4WYpdgoIcn6"
}

@app.route("/spotify/play", methods=["POST"])
def play_music():
    data = request.json
    emotion = data("emotion")
    token = data("token")

    sp = spotipy.Spotify(auth=token)
    devices = sp.devices()

    if not devices["devices"]:
        return jsonify({"error": "No active Spotify device found. Open Spotify app."})

    device_id = devices["devices"][0]["id"]


    playlist_id = emotion_playlists.get(emotion)

    if playlist_id:
        sp.start_playback(
            device_id=device_id,
            context_uri=f"spotify:playlist:{playlist_id}")
        return jsonify({"message": "Playing music"})
    
    return jsonify({"error": "No playlist found"})

if __name__ == "__main__":
    app.run(debug=True)