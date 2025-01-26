from flask import Flask, request, jsonify, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_migrate import Migrate
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_cors import CORS
from helpers import login_required
from models import db, User, Collection, Bookmark
from datetime import timedelta
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookmarks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'my-secret-key'  

# Update session configuration
app.config.update(
    SESSION_TYPE='filesystem',
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)
)
Session(app)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app,
     supports_credentials=True,
     origins=["http://127.0.0.1:5173", "http://localhost:5173"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Set-Cookie"])

# @app.before_request
# def log_request_info():
#     print("== Before Request ==")
#     print("Request Cookies:", request.cookies)
#     print("Flask Session:", session)    

# @app.after_request
# def log_cookie_header(response):
#     print("== After Request ==")
#     print("Set-Cookie Header:", response.headers.get("Set-Cookie"))
#     print("Flask Session now:", session)
#     print("CORS Headers:", response.headers)
#     return response

@app.route("/signup", methods=["POST"])
def signup():
    """
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
        session.modified = True
        print("Session data:", session)
        # Initialize the user's collection
        user_collection = Collection(title=f"General", user_id=new_user.id)
        db.session.add(user_collection)
        db.session.commit()
        # Return success response
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "User already exists or an error occurred"}), 400

@app.route("/login", methods=["POST"])
def login():
    """Log user in"""
    # Forget any user_id
    session.clear()
    # Perform some validation
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email:
        return jsonify({"error": "must provide email"}), 400
    # Ensure password was submitted
    elif not password:
        return jsonify({"error": "must provide password"}), 400
    # Query database for username
    user = User.query.filter_by(email=email).first()

    # Ensure username exists and password is correct
    if not user or not check_password_hash(user.hash, password):
        return jsonify({"error": "invalid username and/or password"}), 400

    # Remember which user has logged in
    session["user_id"] = user.id
    session.modified = True
    print("LoginSession data set:", session)
    return jsonify({"message": "User logged in successfully"}), 200

@app.route("/logout")
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return jsonify({"message": "User logged out successfully"}), 200

@app.route("/check-auth", methods=["GET"])
def check_auth():
    print("Session data:", session)
    if session.get("user_id"):  
        return jsonify({"isAuthenticated": True}), 200
    return jsonify({"isAuthenticated": False}), 401

@app.route('/bookmarks', methods=['POST'])
@login_required
def create_bookmark():
    data = request.get_json()
    title = data.get('title')
    url = data.get('url')
    description = data.get('description', '')
    collection_id = data.get('collectionId')

    if not url or not title:
        return jsonify({'error': 'Title and URL are required'}), 400

    try:
        bookmark = Bookmark(
            title=title,
            url=url,
            description=description,
            user_id=session["user_id"],
            collection_id=collection_id
        )
        db.session.add(bookmark)
        db.session.commit()

        return jsonify({
            'message': 'Bookmark created successfully',
            'bookmark': {
                'id': bookmark.id,
                'title': bookmark.title,
                'url': bookmark.url,
                'description': bookmark.description,
                'collection_id': bookmark.collection_id,
                'created_at': bookmark.created_at
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error creating bookmark: {str(e)}")
        return jsonify({'error': 'Failed to create bookmark'}), 500

@app.route('/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    bookmarks = Bookmark.query.join(Collection, Bookmark.collection_id == Collection.id).order_by(Bookmark.created_at.desc()).filter_by(user_id=session["user_id"]).all()
    result = []
    for bookmark in bookmarks:
        result.append({    
            'id': bookmark.id,
            'title': bookmark.title,
            'url': bookmark.url,
            'description': bookmark.description,
            'collection_id': bookmark.collection_id,
            'collection_title': bookmark.collection.title,
            'created_at': bookmark.created_at
        })
    return jsonify(result), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['GET'])
@login_required
def get_bookmark(bookmark_id):
    bookmark = Bookmark.query.join(Collection, Bookmark.collection_id == Collection.id).filter_by(user_id=session["user_id"]).get_or_404(bookmark_id)
    return jsonify({
        'id': bookmark.id,
        'title': bookmark.title,
        'url': bookmark.url,
        'description': bookmark.description,
        'created_at': bookmark.created_at
    }), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['PUT'])
@login_required
def update_bookmark(bookmark_id):
    data = request.get_json()
    # First get the bookmark by ID, then check if it belongs to the user
    bookmark = Bookmark.query.get_or_404(bookmark_id)
    
    # Check if the bookmark belongs to the current user
    if bookmark.user_id != session["user_id"]:
        return jsonify({"error": "Unauthorized"}), 403

    bookmark.title = data.get('title', bookmark.title)
    bookmark.url = data.get('url', bookmark.url)
    bookmark.description = data.get('description', bookmark.description)
    bookmark.collection_id = data.get('collectionId', bookmark.collection_id)
    
    db.session.commit()

    return jsonify({'message': 'Bookmark updated successfully', 'bookmark': {
        'id': bookmark.id,
        'title': bookmark.title,
        'url': bookmark.url,
        'description': bookmark.description,
        'created_at': bookmark.created_at
    }}), 200

@app.route('/bookmarks/<int:bookmark_id>', methods=['DELETE'])
@login_required
def delete_bookmark(bookmark_id):
    # First get the bookmark, then check if it belongs to the user
    bookmark = Bookmark.query.get_or_404(bookmark_id)
    
    # Check if the bookmark belongs to the current user
    if bookmark.user_id != session["user_id"]:
        return jsonify({"error": "Unauthorized"}), 403
        
    db.session.delete(bookmark)
    db.session.commit()
    
    return jsonify({"message": "Bookmark deleted successfully"}), 200

@app.route('/collections', methods=['POST'])
@login_required
def create_collection():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    if not title:
        return jsonify({'error': 'Collection name is required'}), 400
    
    # prevent duplicate collection titles
    existing_collection = Collection.query.filter_by(title=title, user_id=session["user_id"]).first()
    if existing_collection:
        return jsonify({'error': 'Collection with this name already exists'}), 400

    collection = Collection(title=title, description=description, user_id=session["user_id"])
    db.session.add(collection)
    db.session.commit()

    return jsonify({'message': 'Collection created successfully', 'collection': {
        'id': collection.id,
        'title': collection.title,
        'description': collection.description,
        'created_at': collection.created_at
    }}), 200

@app.route('/collections', methods=['GET'])
@login_required
def get_collections():
    collections = Collection.query.order_by(Collection.created_at.desc()).filter_by(user_id=session["user_id"]).all()
    result = []
    for collection in collections:
        result.append({
            'id': collection.id,
            'title': collection.title,
            'description': collection.description,
            'created_at': collection.created_at
        })
    return jsonify(result), 200

@app.route('/collections/<int:collection_id>', methods=['GET'])
@login_required
def get_collection_title(collection_id):
    collection = Collection.query.get_or_404(collection_id)

    # Check if the collection belongs to the current user
    if collection.user_id != session["user_id"]:
        return jsonify({"error": "Unauthorized"}), 403
        
    return jsonify({'title': collection.title}), 200    

@app.route('/collection_bookmarks/<int:collection_id>', methods=['GET'])
@login_required
def get_collection_bookmarks(collection_id):
    bookmarks = Bookmark.query.filter_by(collection_id=collection_id).all()
    collection = Collection.query.get_or_404(collection_id)

    # Check if the collection belongs to the current user
    if collection.user_id != session["user_id"]:
        return jsonify({"error": "Unauthorized"}), 403

    result = []
    for bookmark in bookmarks:
        result.append({
            'id': bookmark.id,
            'title': bookmark.title,
            'url': bookmark.url,
            'description': bookmark.description,
            'created_at': bookmark.created_at,
            'collection_title': collection.title
        })
    return jsonify(result), 200

@app.route('/preview', methods=['GET'])
@login_required
def get_preview():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        # Add http:// if not present
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        # Fetch the webpage
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Get meta tags
        meta_tags = soup.find_all('meta')
        
        # Initialize preview data
        preview_data = {
            'title': None,
            'description': None,
            'image': None
        }

        # Try to get OpenGraph data first
        for tag in meta_tags:
            if 'property' in tag.attrs:
                if tag.attrs['property'] == 'og:title':
                    preview_data['title'] = tag.attrs.get('content')
                elif tag.attrs['property'] == 'og:description':
                    preview_data['description'] = tag.attrs.get('content')
                elif tag.attrs['property'] == 'og:image':
                    image_url = tag.attrs.get('content')
                    if image_url:
                        preview_data['image'] = urljoin(url, image_url)

        # Fallback to regular meta tags if OpenGraph not found
        if not preview_data['title']:
            title_tag = soup.find('title')
            if title_tag:
                preview_data['title'] = title_tag.string

        if not preview_data['description']:
            desc_tag = soup.find('meta', attrs={'name': 'description'})
            if desc_tag:
                preview_data['description'] = desc_tag.get('content')

        # If still no image, try to find first image on page
        if not preview_data['image']:
            first_img = soup.find('img')
            if first_img and 'src' in first_img.attrs:
                preview_data['image'] = urljoin(url, first_img['src'])

        return jsonify(preview_data)

    except Exception as e:
        print(f"Error fetching preview: {str(e)}")
        return jsonify({'error': 'Failed to fetch preview'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
