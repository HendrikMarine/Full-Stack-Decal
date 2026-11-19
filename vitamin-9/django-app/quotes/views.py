from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Quote
import random
import json


def quote_to_dict(quote):
    return {"id": quote.id, "text": quote.text, "author": quote.author}


def parse_body(request):
    """Return the JSON body as a dict, or None if it is missing or invalid."""
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


# ============ TEMPLATE VIEWS (return HTML) ============

# TODO 7: home view, a random quote rendered with quotes/home.html
def home(request):
    quotes = list(Quote.objects.all())
    quote = random.choice(quotes) if quotes else None
    return render(request, "quotes/home.html", {"quote": quote})


# TODO 8: all_quotes view, every quote rendered with quotes/all_quotes.html
def all_quotes(request):
    quotes = Quote.objects.all()
    return render(request, "quotes/all_quotes.html", {"quotes": quotes})


# ============ API VIEWS (return JSON) ============

# TODO 9: random_quote_api, a random quote as JSON
def random_quote_api(request):
    quotes = list(Quote.objects.all())
    if not quotes:
        return JsonResponse({"error": "No quotes available"}, status=404)
    return JsonResponse(quote_to_dict(random.choice(quotes)))


@csrf_exempt  # Allows POST/PUT/DELETE without CSRF token
def quotes_api(request):
    # TODO 10: GET /api/quotes/ lists all quotes, POST /api/quotes/ creates one
    if request.method == "GET":
        quotes = [quote_to_dict(q) for q in Quote.objects.all()]
        return JsonResponse(quotes, safe=False)

    if request.method == "POST":
        data = parse_body(request)
        if data is None or "text" not in data or "author" not in data:
            return JsonResponse({"error": "Request body must be JSON with 'text' and 'author'"}, status=400)
        quote = Quote.objects.create(text=data["text"], author=data["author"])
        return JsonResponse(quote_to_dict(quote), status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def quote_detail_api(request, id):
    # TODO 11: GET, PUT, DELETE for /api/quotes/<id>/
    try:
        quote = Quote.objects.get(id=id)
    except Quote.DoesNotExist:
        return JsonResponse({"error": "Quote not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(quote_to_dict(quote))

    if request.method == "PUT":
        data = parse_body(request)
        if data is None:
            return JsonResponse({"error": "Request body must be JSON"}, status=400)
        if "text" in data:
            quote.text = data["text"]
        if "author" in data:
            quote.author = data["author"]
        quote.save()
        return JsonResponse(quote_to_dict(quote))

    if request.method == "DELETE":
        quote.delete()
        return JsonResponse({"message": f"Quote {id} deleted"})

    return JsonResponse({"error": "Method not allowed"}, status=405)
