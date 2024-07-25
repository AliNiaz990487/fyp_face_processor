# myproject/urls.py

from django.contrib import admin
from django.urls import path
from api_app.views import ProcessImageAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('process-image/', ProcessImageAPI.as_view(), name='process-image'),
]
