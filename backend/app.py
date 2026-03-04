from flask import Flask, jsonify
from flask_cors import CORS
from database import init_db

init_db()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Feelix Backend Running"})

if __name__ == "__main__":
    app.run(debug=True)