from .models import User, Notification

def user_context(request):
    """
    A context processor to add user data to all templates.
    """
    if 'user_id' in request.session:
        try:
            user = User.objects.get(id=request.session['user_id'])
            user_name = f"{user.first_name} {user.last_name}"

            default_picture = '/static/profile_pictures/default_profile.jpg'
            user_profile = user.picture if user.picture else default_picture

            return {
                'user_name': user_name,
                'user_birthday': user.birthday.strftime('%B %d, %Y') if user.birthday else None,
                'user_email': user.email,
                'user_profile': user_profile,
            }
        except User.DoesNotExist:
            pass

    # default context if no user is found
    return {
        'user_name': None,
        'birthday': None,
        'email': None,
        'user_profile': '/static/profile_pictures/default_profile.jpg', 
    }

def notifications_context(request):
    if 'user_id' in request.session:
        user = User.objects.get(id=request.session['user_id'])
        return {
            'notifications': Notification.objects.filter(user=user, is_read=False)
        }
    return {'notifications': []}