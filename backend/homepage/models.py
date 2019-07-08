from django.db import models
from django.db.models import signals
from django.contrib.auth.models import User

import base64

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,primary_key=True)
    number = models.IntegerField(default=1)
    

    def __str__(self):
        return str(self.user)

## 클래스 밖에 정의된 함수입니다 
# def create_profile(sender, instance, created, **kwargs):
#     #create Profile for every new User model
#     if created:
#         Profile.objects.create(user=instance)
# signals.post_save.connect(create_profile, sender='auth.User', weak=False)
##, dispatch_uid='models.create_profile'

def create_profile_and_group(sender, instance, created, **kwargs):
    #create User Group for every new User model
    if created:
       
        profile = Profile()
        profile.user=instance
        profile.save()
        
signals.post_save.connect(create_profile_and_group, sender='auth.User', weak=False)
