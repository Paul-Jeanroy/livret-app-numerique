from django.db import models

class Referentiel(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.nom

class Apprenti(models.Model):
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    entreprise = models.CharField(max_length=200)
    referentiel = models.ForeignKey(Referentiel, on_delete=models.CASCADE)
    note_softskills = models.IntegerField()

    def __str__(self):
        return f"{self.prenom} {self.nom}"