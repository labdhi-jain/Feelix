import sqlite3

def get_connection():
    return sqlite3.connect("feelix.db")

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
    

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    emotion TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


def save_emotion(user_id, emotion):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO emotions (user_id, emotion) VALUES (?, ?)",
        (user_id, emotion)
    )

    conn.commit()
    conn.close()
def create_user(username, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, password)
    )

    conn.commit()
    conn.close()


def get_user(username):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=?",
        (username,)
    )

    user = cursor.fetchone()
    conn.close()

    return user
    
def get_emotions():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT emotion, timestamp FROM emotions ORDER BY timestamp DESC")
    data = cursor.fetchall()

    conn.close()
    return data

def create_user(username, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, password)
    )

    conn.commit()
    conn.close()


def get_user(username):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=?",
        (username,)
    )

    user = cursor.fetchone()
    conn.close()

    return user