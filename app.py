from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Dummy user data (replace with database in future)
users = {
    'admin@example.com': {
        'name': 'Admin User',
        'password': 'admin123',  # In real app, use hashed passwords
        'email': 'admin@example.com'
    }
}

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
        
        # Check credentials (in real app, use database and hashed passwords)
        if email in users and users[email]['password'] == password:
            session['user'] = users[email]
            return jsonify({'success': True, 'message': 'Login successful!'})
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials!'})
    
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    
    # Check if user already exists
    if email in users:
        return jsonify({'success': False, 'message': 'User already exists!'})
    
    # Create new user
    users[email] = {
        'name': name,
        'password': password,  # In real app, hash this password
        'email': email
    }
    
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