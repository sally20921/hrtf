from rest_framework import serializers
from django.contrib.auth.models import User
from homepage.models import *
from django.db.models import Sum, Q
import base64
from django.conf import settings
from rest_framework.fields import (  # NOQA # isort:skip
    CreateOnlyDefault, CurrentUserDefault, SkipField, empty
)

class UserSerializer(serializers.ModelSerializer):

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
 
    class Meta:
        model = User
        #article
        fields = ('id','username','password')


class ProfileSerializer(serializers.ModelSerializer):
    user= serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Profile
        fields = ('user','recent','user_group')

