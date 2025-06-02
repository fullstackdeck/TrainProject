from django.db import models
from django.contrib.auth.models import User

from Students.models import Apprenant


class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Instructeur : {self.user.username}"


class Course(models.Model):
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name="courses")
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    apprenants=models.ManyToManyField(Apprenant, related_name="cous_suivi")
    

    def __str__(self):
        return self.title


class Chapter(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('text', 'Texte'),
        ('video', 'Vidéo'),
        ('pdf', 'PDF'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    content_text = models.TextField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    pdf_file = models.FileField(upload_to='chapter_pdfs/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.course.title} - {self.title}"
