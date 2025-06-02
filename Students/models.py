from django.contrib.auth.models import User
from django.db import models

class Apprenant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Tu peux ajouter d'autres infos si besoin

    def __str__(self):
        return self.user.get_full_name()
