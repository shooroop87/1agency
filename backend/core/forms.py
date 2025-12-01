# backend/core/forms.py
from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Your name'
    }))
    email = forms.EmailField(required=False, widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email'
    }))
    phone = forms.CharField(max_length=20, widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Phone'
    }))
    message = forms.CharField(required=False, widget=forms.Textarea(attrs={
        'class': 'form-control',
        'placeholder': 'Message',
        'rows': 4
    }))
    property_type = forms.CharField(required=False, max_length=50)
    privacy = forms.BooleanField(required=True)


class CallbackForm(forms.Form):
    name = forms.CharField(max_length=100)
    phone = forms.CharField(max_length=20)
    privacy = forms.BooleanField(required=True)


class ServiceRequestForm(forms.Form):
    name = forms.CharField(max_length=100)
    phone = forms.CharField(max_length=20)
    email = forms.EmailField(required=False)
    message = forms.CharField(required=False, widget=forms.Textarea())
    privacy = forms.BooleanField(required=True)  # ← тут было без скобок


class FAQQuestionForm(forms.Form):
    name = forms.CharField(max_length=100)
    phone = forms.CharField(max_length=20)
    email = forms.EmailField(required=False)
    message = forms.CharField(widget=forms.Textarea())
    privacy = forms.BooleanField(required=True)