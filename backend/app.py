import bcrypt
from database import create_user, get_user
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
from emotion import detect_emotion
from database import init_db, save_emotion, get_emotions

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

if __name__ == "__main__":
    app.run(debug=True)