# Vitamin 9: Flask, Django, and Deployment

Quote of the Day built twice: a Flask JSON API (`flask-backend/`) and a full Django MVT app (`django-app/`) that deploys to Vercel.

## Run it

From `vitamin-9/`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r flask-backend/requirements.txt django
```

**Flask** (http://localhost:5000):

```bash
cd flask-backend && python app.py
```

**Django** (http://localhost:8000):

```bash
cd django-app
python manage.py migrate          # creates the tables and seeds 5 quotes (0002_seed_quotes)
python manage.py createsuperuser  # only needed for /admin
python manage.py runserver
```

Pages: `/` random quote, `/all/` all quotes, `/admin/` admin panel.

## Endpoints

| Method | Flask | Django | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/quote` | `/api/quote/` | 200, random quote | |
| GET | `/api/quotes` | `/api/quotes/` | 200, list | |
| POST | `/api/quotes` | `/api/quotes/` | 201, the new quote | 400 if `text` or `author` is missing |
| GET | | `/api/quotes/<id>/` | 200, one quote | 404 |
| PUT | `/api/quotes/<id>` | `/api/quotes/<id>/` | 200, updated quote (`text` and/or `author`) | 404 |
| DELETE | `/api/quotes/<id>` | `/api/quotes/<id>/` | 200, `{"message": "Quote <id> deleted"}` | 404 |

Django URLs need the trailing slash. A POST to `/api/quotes` without it fails, because Django can't redirect a POST.

## Where each TODO lives

| TODO | File |
| --- | --- |
| 1-5 Flask routes | `flask-backend/app.py` |
| 6 Quote model | `django-app/quotes/models.py` |
| 7-11 Views | `django-app/quotes/views.py` |
| 12, 13 Page URLs + `include()` | `django-app/quotes/urls.py` |
| 14 API URLs | `django-app/quotes/api_urls.py` |
| 15, 16 Templates | `django-app/quotes/templates/quotes/{home,all_quotes}.html` |

## Notes

- The starter templates put `{{ }}` and `{% for %}` inside HTML comments. Django still parses tags inside `<!-- -->`, so `{{ }}` raises "Empty variable tag" and the commented `{% for %}` opens a real loop. The TODO comments are Django `{# #}` comments instead.
- Vercel deploy: the project folder is read-only there and `db.sqlite3` is gitignored, so `settings.py` points the database at `/tmp/db.sqlite3` when the `VERCEL` env var is set, and `wsgi.py` runs `migrate` when the function starts. That builds the tables and runs `0002_seed_quotes`, so the deployed site always has the 5 quotes. Quotes added through the API on Vercel last until the function instance recycles.
- Vercel's Python runtime defaults to 3.12, which current Django (6.x) requires.

## Submit

Upload `vitamin-9.zip` from the repo root to Gradescope, plus the deployed Vercel URL. The zip has `flask-backend/` and `django-app/` at its top level, with no `venv/`, `db.sqlite3`, or `__pycache__/`.
