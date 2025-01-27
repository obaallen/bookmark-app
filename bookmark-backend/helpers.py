import requests

from flask import session, jsonify
from functools import wraps


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return jsonify({"error": "Must be logged in"}), 400
        return f(*args, **kwargs)

    return decorated_function

