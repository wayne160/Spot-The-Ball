from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import smtplib
from email.message import EmailMessage
from fastapi import HTTPException
import os
from dotenv import load_dotenv
load_dotenv()

EMAIL = os.environ.get("EMAIL")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
FRONTEND_URL = os.environ.get("FRONTEND_URL")

app = FastAPI()

print(FRONTEND_URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


conn = sqlite3.connect("table.db", check_same_thread=False)
cur = conn.cursor()

cur.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        proximity REAL,
        prize TEXT
    )
    """
)
conn.commit()

@app.post('/user')
def add_user(data: dict):
    email = data.get('email')
    proximity = data.get('proximity')
    prize = data.get('prize')
    cur = conn.cursor()
    try:
        cur.execute('INSERT INTO users (email, proximity, prize) VALUES (?, ?, ?)', (email, proximity, prize))
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already submitted.")
    conn.commit()
    return {'id': cur.lastrowid, 'email': email, 'proximity': proximity}

@app.get('/users')
def get_users():
    cur = conn.cursor()
    cur.execute('SELECT email, proximity, prize FROM users ORDER BY proximity LIMIT 10')
    rows = cur.fetchall()
    return [{"email": r[0], "proximity": r[1], "prize": r[2]} for r in rows]

@app.post("/email")
def send_email(data: dict):
    msg = EmailMessage()
    msg['Subject'] = 'Spot the Ball'
    msg['From'] = os.environ.get("email")
    msg['To'] = data['email']

    msg.set_content(f'Your entry to win the {data['prize']} is confirmed.')

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL, EMAIL_PASSWORD)
        smtp.send_message(msg)

    return {"message": "Email sent"}