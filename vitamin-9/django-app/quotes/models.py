from django.db import models


# TODO 6: Quote model with text, author, and __str__ returning the text
class Quote(models.Model):
    text = models.CharField(max_length=500)
    author = models.CharField(max_length=100)

    def __str__(self):
        return self.text
