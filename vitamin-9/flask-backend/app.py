from flask import Flask, jsonify, request
import random

app = Flask(__name__)

quotes = [
    {"id": 1, "text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"id": 2, "text": "Code is like humor. When you have to explain it, it's bad.", "author": "Cory House"},
    {"id": 3, "text": "First, solve the problem. Then, write the code.", "author": "John Johnson"},
    {"id": 4, "text": "Simplicity is the soul of efficiency.", "author": "Austin Freeman"},
    {"id": 5, "text": "Fix the cause, not the symptom.", "author": "Steve Maguire"},
]

next_id = 6  # For generating new IDs


def find_quote(quote_id):
    """Return the quote with this id, or None."""
    for quote in quotes:
        if quote["id"] == quote_id:
            return quote
    return None


# TODO 1: GET /api/quote - return a random quote as JSON
@app.route("/api/quote", methods=["GET"])
def random_quote():
    if not quotes:
        return jsonify({"error": "No quotes available"}), 404
    return jsonify(random.choice(quotes))


# TODO 2: GET /api/quotes - return all quotes as JSON
@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    return jsonify(quotes)


# TODO 3: POST /api/quotes - add a new quote
@app.route("/api/quotes", methods=["POST"])
def add_quote():
    global next_id
    data = request.get_json(silent=True)  # same as request.json, but None instead of an error on a bad body
    if not data or "text" not in data or "author" not in data:
        return jsonify({"error": "Request body must be JSON with 'text' and 'author'"}), 400

    new_quote = {"id": next_id, "text": data["text"], "author": data["author"]}
    quotes.append(new_quote)
    next_id += 1
    return jsonify(new_quote), 201


# TODO 4: PUT /api/quotes/<id> - update a quote by id
@app.route("/api/quotes/<int:id>", methods=["PUT"])
def update_quote(id):
    data = request.get_json(silent=True) or {}
    quote = find_quote(id)
    if quote is None:
        return jsonify({"error": "Quote not found"}), 404

    if "text" in data:
        quote["text"] = data["text"]
    if "author" in data:
        quote["author"] = data["author"]
    return jsonify(quote)


# TODO 5: DELETE /api/quotes/<id> - delete a quote by id
@app.route("/api/quotes/<int:id>", methods=["DELETE"])
def delete_quote(id):
    quote = find_quote(id)
    if quote is None:
        return jsonify({"error": "Quote not found"}), 404

    quotes.remove(quote)
    return jsonify({"message": f"Quote {id} deleted"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
