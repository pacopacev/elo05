from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Document, DocumentVersion
import hashlib

@receiver(pre_save, sender=DocumentVersion)
def calculate_file_checksum(sender, instance, **kwargs):
    if instance.file and not instance.checksum:
        file = instance.file
        file.seek(0)
        sha256_hash = hashlib.sha256()
        for chunk in file.chunks():
            sha256_hash.update(chunk)
        instance.checksum = sha256_hash.hexdigest()