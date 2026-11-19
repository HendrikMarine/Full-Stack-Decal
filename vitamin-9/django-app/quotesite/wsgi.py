import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quotesite.settings')

application = get_wsgi_application()

# Vercel never runs migrate for us, and its database is a fresh file in /tmp
# (see settings.py), so build the tables and seed quotes when the function starts.
if os.environ.get('VERCEL'):
    from django.core.management import call_command
    call_command('migrate', interactive=False, verbosity=0)

app = application  # Vercel needs this
