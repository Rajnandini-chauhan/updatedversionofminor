from flask import Flask, render_template, request, jsonify, redirect, url_for, session

# import to handle the DB Operations
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your-secret-key-here"

DB_NAME = "users.db"

# Function to Create the DB
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Function to establish connection to DB (to be able to write the query)
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

init_db() # initalizing DB Before APP start


@app.route('/')
def home():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        conn = get_db_connection() # Getting Connection to DB
        c = conn.cursor()

        c.execute("SELECT * FROM users WHERE email = ?", (email,)) # Executing SQL Query
        user = c.fetchone()
        conn.close()

        if user and check_password_hash(user["password"], password):
            session['user'] = {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
            return jsonify({'success': True, 'message': 'Login successful!'})

        return jsonify({'success': False, 'message': 'Invalid credentials!'})

    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    conn = get_db_connection() # Getting Connection to DB
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE email = ?", (email,)) # Executing SQL Query
    existing = c.fetchone()

    if existing:
        conn.close()
        return jsonify({'success': False, 'message': 'User already exists!'})

    hashed_password = generate_password_hash(password)

    c.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, hashed_password)
    ) # Adding New User to DB

    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'Registration successful!'})

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', user=session['user'])

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route('/video_feed')
def video_feed():
    # Placeholder for video feed
    return "Video feed placeholder"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
