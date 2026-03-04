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
    data = request.json["image"]
    emotion = detect_emotion(data)
    save_emotion(emotion)
    return jsonify({"emotion": emotion})

@app.route("/analytics", methods=["GET"])
def analytics():
    emotions = get_emotions()
    return jsonify({"data": emotions})

@app.route("/")
def home():
    return jsonify({"message": "Feelix Backend Running"})

if __name__ == "__main__":
    app.run(debug=True)