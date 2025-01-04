from django import forms
from django.contrib.auth.hashers import check_password
from django.contrib.auth.forms import PasswordChangeForm
from .models import User, Project, Task, TaskAssignment, Notification, ProjectMembership

class UserRegistrationForm(forms.ModelForm):
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Confirm Password'
        })
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'birthday', 'email', 'password']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'First Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Last Name'
            }),
            'birthday': forms.DateInput(attrs={
                'class': 'form-input',
                'placeholder': 'Date of Birth',
                'type': 'date'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'Email Address'
            }),
            'password': forms.PasswordInput(attrs={
                'class': 'form-input',
                'placeholder': 'Password'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data
    
    
class LoginForm(forms.Form):
    email = forms.EmailField(
        label="Email Address",
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'}),
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}),
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise forms.ValidationError("Invalid email or password.")

        if not check_password(password, user.password):
            raise forms.ValidationError("Invalid email or password.")

        self.user = user
        return cleaned_data


class ProfileEditForm(forms.ModelForm):
    profile_picture = forms.ImageField(required=False, widget=forms.FileInput(attrs={
        'accept': '.jpg,.jpeg,.png',
    }))

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'birthday', 'profile_picture']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'First Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Last Name'
            }),
            'birthday': forms.DateInput(attrs={'type': 'date'}),
            'email': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'E-mail Address'
            }),
        }


class PasswordChangeForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Old Password'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'New Password'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Confirm New Password'}))

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_old_password(self):
        old_password = self.cleaned_data.get('old_password')
        
        if not self.user.check_password(old_password):
            raise forms.ValidationError("The old password is incorrect.")
        return old_password

    def clean(self):
        cleaned_data = super().clean()
        new_password1 = cleaned_data.get('new_password1')
        new_password2 = cleaned_data.get('new_password2')

        if new_password1 != new_password2:
            raise forms.ValidationError("The two new passwords do not match.")
        return cleaned_data
