from flask import Flask, request, jsonify, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_migrate import Migrate
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from helpers import apology, login_required
from models import User, Collection, Bookmark

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookmarks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route("/Signup", methods=["GET", "POST"])
def Signup():
    """Register user"""
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        email = request.form.get("email")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not email:
            return apology("must provide email", 400)

        # Ensure password was submitted
        elif not password:
            return apology("must provide password", 400)

        # Ensure confirmation was submitted
        elif not confirmation:
            return apology("must provide confirmation", 400)

        # Ensure confirmation matches password
        elif confirmation != password:
            return apology("password and confirmation must match", 400)

        # attempt to insert detail in database
        try:
            hashed_password = generate_password_hash(password)
            new_user = User(email=email, hash=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            Session["user_id"] = new_user.id
            # Redirect user to home page
            return redirect("/")
        except:
            return apology("user already exists", 400)

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return redirect("/Signup")


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
