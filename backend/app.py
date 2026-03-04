from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
from emotion import detect_emotion
from database import init_db

init_db()

app = Flask(__name__)
CORS(app)
@app.route("/detect", methods=["POST"])
def detect():
    data = request.json["image"]
    emotion = detect_emotion(data)
    return jsonify({"emotion": emotion})

@app.route("/")
def home():
    return jsonify({"message": "Feelix Backend Running"})

if __name__ == "__main__":
    app.run(debug=True)