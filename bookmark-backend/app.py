from flask import Flask, request, jsonify, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_migrate import Migrate
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_cors import CORS
from helpers import apology, login_required
from models import db, User, Collection, Bookmark

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookmarks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'  
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_COOKIE_NAME'] = 'session'
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False
Session(app)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True, origins="http://localhost:5173",)

@app.before_request
def log_request_info():
    print("Request Cookies:", request.cookies)  # Log all cookies sent by the client
    print("Session Data:", session)     

@app.after_request
def log_cookie_header(response):
    print("Set-Cookie Header:", response.headers.get("Set-Cookie"))
    return response

@app.route("/signup", methods=["POST"])
def signup():
    """s
    Register user
    User reached route via POST (as by submitting a form via POST)
    """
    # Perform some validation
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    confirmation = data.get("confirmation")

    if not email:
        return jsonify({"error": "must provide email"}), 400

    # Ensure password was submitted
    elif not password:
        return jsonify({"error": "must provide password"}), 400

    # Ensure confirmation was submitted
    elif not confirmation:
        return jsonify({"error": "must provide confirmation"}), 400

    # Ensure confirmation matches password
    elif confirmation != password:
        return jsonify({"error": "password and confirmation must match"}), 400

    # attempt to insert detail in database
    try:
        hashed_password = generate_password_hash(password)
        new_user = User(email=email, hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        print("Session data:", session)
        # Return success response
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "User already exists or an error occurred"}), 400

@app.route("/check-auth", methods=["GET"])
def check_auth():
    print("Session data:", session)
    if session.get("user_id"):  
        return jsonify({"isAuthenticated": True}), 200
    return jsonify({"isAuthenticated": False}), 401

@app.route('/bookmarks', methods=['POST'])
def create_bookmark():
    data = request.get_json()
    title = data.get('title')
    url = data.get('url')
    description = data.get('description', '')

    if not title or not url:
        return jsonify({'error': 'Title and URL are required'}), 400

    bookmark = Bookmark(title=title, url=url, description=description)
    db.session.add(bookmark)
    db.session.commit()

    return jsonify({'message': 'Bookmark created successfully', 'bookmark': {
        'id': bookmark.id,
        'title': bookmark.title,
        'url': bookmark.url,
        'description': bookmark.description,
        'created_at': bookmark.created_at
    }}), 201

@app.route('/bookmarks', methods=['GET'])
def get_bookmarks():
    bookmarks = Bookmark.query.all()
    result = []
    for bookmark in bookmarks:
        result.append({
            'id': bookmark.id,
            'title': bookmark.title,
            'url': bookmark.url,
            'description': bookmark.description,
            'created_at': bookmark.created_at
        })
    return jsonify(result), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['GET'])
def get_bookmark(bookmark_id):
    bookmark = Bookmark.query.get_or_404(bookmark_id)
    return jsonify({
        'id': bookmark.id,
        'title': bookmark.title,
        'url': bookmark.url,
        'description': bookmark.description,
        'created_at': bookmark.created_at
    }), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['PUT'])
def update_bookmark(bookmark_id):
    data = request.get_json()
    bookmark = Bookmark.query.get_or_404(bookmark_id)

    bookmark.title = data.get('title', bookmark.title)
    bookmark.url = data.get('url', bookmark.url)
    bookmark.description = data.get('description', bookmark.description)

    db.session.commit()

    return jsonify({'message': 'Bookmark updated successfully', 'bookmark': {
        'id': bookmark.id,
        'title': bookmark.title,
        'url': bookmark.url,
        'description': bookmark.description,
        'created_at': bookmark.created_at
    }}), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    bookmark = Bookmark.query.get_or_404(bookmark_id)
    db.session.delete(bookmark)
    db.session.commit()

    return jsonify({'message': 'Bookmark deleted successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
