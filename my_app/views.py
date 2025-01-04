from django.http import HttpResponse, JsonResponse, HttpResponseForbidden
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Q, Avg
from django.core.exceptions import ValidationError
from .models import User, Project, Task, TaskAssignment, Notification, ProjectMembership
from .forms import UserRegistrationForm, LoginForm, ProfileEditForm, PasswordChangeForm
from django.views.decorators.csrf import csrf_exempt
from . import models
from datetime import datetime
import json


def index(request):
    template = "index.html"
    context = {
        "title" : "E-Hive",
    }
    
    return render(request, template, context)


def login(request):
    if 'user_id' in request.session:
        return redirect('home')

    next_url = request.GET.get('next', 'home')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            
            user = form.user
            request.session['user_id'] = user.id
            request.session.modified = True
            return redirect(request.POST.get('next', 'home'))
        else:
            messages.error(request, "Invalid email or password.")
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form, 'next': next_url})



def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegistrationForm()

    return render(request, 'register.html', {'form': form})



def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if 'user_id' not in request.session:
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper



def logout(request):
    try:
        del request.session['user_id']
    except KeyError:
        pass
    return redirect('login')



@login_required
def home(request):
    template = "home.html"
    user = User.objects.get(pk=request.session['user_id'])
    
    projects = Project.objects.filter(
        Q(user=user) & Q(is_archived=False)
    ).distinct()
    

    sharedProjects = Project.objects.filter(
        memberships__user=user,
        is_archived = False
    ).exclude(user=user).distinct()
    
    
    project_count = projects.count()
    shared_project_count = sharedProjects.count()
    
    print(f"User: {user}")
    print(f"Projects: {projects}")
    
    context = {
        "title": "E-Hive",
        "projects": projects,
        "sharedProjects": sharedProjects,
        "project_count": project_count,
        "shared_project_count": shared_project_count,
    }
    
    return render(request, template, context)

def forgot_password(request):
    template = "forgot_password.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)

def forgot_password2(request):
    template = "forgot_password2.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)

def forgot_password3(request):
    template = "forgot_password3.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)

def forgot_password4(request):
    template = "forgot_password4.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)



@login_required
def project(request):
    template = "project.html"
    user = User.objects.get(pk=request.session['user_id'])
    
    projects = Project.objects.filter(
        (Q(user=user) | Q(memberships__user=user)) & Q(is_archived=False)
    ).distinct().annotate(progress=Avg('tasks__progress'))
    
    print(f"User: {user}")
    print(f"Projects: {projects}")
    
    context = {
        "title": "E-Hive",
        "projects": projects
    }
    
    return render(request, template, context)

def project_list(request):
    status = request.GET.get('status', 'all')
    sort = request.GET.get('sort', 'asc')

    projects = Project.objects.all()

    if status != 'all':
        projects = projects.filter(project_status=status.upper().replace('-', '_'))

    if sort == 'asc':
        projects = projects.order_by('project_name')
    elif sort == 'desc':
        projects = projects.order_by('-project_name')

    return render(request, 'projects/dashboard.html', {
        'projects': projects
    })
    
def create_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            project_name = data.get('project_name')
            project_description = data.get('project_description')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            project_status = data.get('project_status')
            project_priority = data.get('project_priority')
            user = User.objects.get(pk=request.session['user_id'])
            
            project = Project.objects.create(
                project_name=project_name,
                project_description=project_description,
                start_date=start_date,
                end_date=end_date,
                project_status=project_status,
                project_priority=project_priority,
                user=user
            )
            return JsonResponse({'status': 'success', 'message': 'Project created successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method Not Allowed.'}, status=405)


def edit_project(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            project_name = data.get('project_name')
            project_description = data.get('project_description')
            start_date_str = data.get('start_date')
            end_date_str = data.get('end_date')
            project_status = data.get('project_status')
            project_priority = data.get('project_priority')

            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

            if end_date and start_date and end_date < start_date:
                return JsonResponse({'status': 'error', 'message': 'End date cannot be earlier than start date.'}, status=400)

            project = get_object_or_404(Project, pk=project_id)
            
            project.project_name = project_name
            project.project_description = project_description
            project.start_date = start_date
            project.end_date = end_date
            project.project_status = project_status
            project.project_priority = project_priority
            project.save()
            
            updated_project_data = {
                'id': project.id,
                'project_name': project.project_name,
                'project_description': project.project_description,
                'start_date': project.start_date.strftime('%Y-%m-%d') if project.start_date else None,
                'end_date': project.end_date.strftime('%Y-%m-%d') if project.end_date else None,
                'project_status': project.project_status,
                'project_priority': project.project_priority,
                'user': {
                    'id': project.user.id,
                    'first_name': project.user.first_name,
                    'last_name': project.user.last_name,
                },
                'members': [
                    {'first_name': member.user.first_name, 'last_name': member.user.last_name}
                    for member in project.memberships.all()
                ]
            }
            
            return JsonResponse({'status': 'success', 'project': updated_project_data})
        
        except Project.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)
        except ValueError as e:
            return JsonResponse({'status': 'error', 'message': f'Invalid date format: {e}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method Not Allowed.'}, status=405)


def get_project_by_id(request, project_id):
    """
    Retrieve a specific project by its ID.
    """
    if request.method == 'GET':
        try:
            project = get_object_or_404(Project, pk=project_id)
            project_data = {
                'id': project.id,
                'project_name': project.project_name,
                'project_description': project.project_description,
                'start_date': project.start_date.strftime('%Y-%m-%d'),
                'end_date': project.end_date.strftime('%Y-%m-%d'),
                'project_status': project.project_status,
                'project_priority': project.project_priority,
                'background': project.background,
                'user': {
                    'id': project.user.id,
                    'first_name': project.user.first_name,
                    'last_name': project.user.last_name,
                }
            }
            return JsonResponse({'status': 'success', 'project': project_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Method Not Allowed'}, status=405)
    
    
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Project, User, ProjectMembership, Notification
import json

def add_project_members(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        user_id = request.session.get('user_id')
        
        # Check if the current user is authorized to add members
        membership = ProjectMembership.objects.filter(
            user_id=user_id, 
            project=project, 
            membership_role='MANAGER'
        ).first()
        
        if not membership:
            return JsonResponse({'error': 'You are not authorized to add members.'}, status=403)
        
        # Parse JSON data from request
        try:
            data = json.loads(request.body)
            emails = data.get('emails', [])
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        added_users = []
        errors = []
        
        for email in emails:
            try:
                # Ensure email is a string
                if isinstance(email, dict):
                    email = email.get('email')  # Extract the email from the object if present
                
                user = User.objects.get(email=email)
                
                # Check if user is already a member
                if ProjectMembership.objects.filter(user=user, project=project).exists():
                    errors.append(f"{email} is already a member.")
                    continue
                
                # Add user to project as a member
                ProjectMembership.objects.create(
                    user=user,
                    project=project,
                    membership_role='MEMBER',
                    is_accepted=False  # Mark as pending invitation
                )
                added_users.append(email)
                
                # Send Notification to the user
                Notification.objects.create(
                    user=user,
                    project=project,
                    notification_message=f"You've been invited to join the project '{project.project_name}'",
                    notification_type='INVITATION'
                )
                
            except User.DoesNotExist:
                errors.append(f"{email} does not exist.")
        
        print("Added Users:", added_users)
        print("Errors:", errors)
        
        return JsonResponse({
            'added_users': added_users,
            'errors': errors,
            'message': 'Members added successfully, and notifications sent.'
        })



def search_users(request):
    query = request.GET.get('q', '').strip()
    project_id = request.GET.get('project_id')

    if not query or not project_id:
        return JsonResponse({'error': 'Invalid query or project ID'}, status=400)
    
    try:
        project = Project.objects.get(id=project_id)
        existing_members = ProjectMembership.objects.filter(project=project).values_list('user_id', flat=True)
        
        users = User.objects.filter(email__icontains=query).exclude(id__in=existing_members)[:10]
        
        return JsonResponse({
            'users': [{'email': user.email, 
                       'first_name': user.first_name, 
                       'last_name': user.last_name,
                       'picture': user.picture
                       } for user in users
                      ]
        })
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)


def search_task_users(request):
    query = request.GET.get('q', '').strip()
    project_id = request.GET.get('project_id')
    task_id = request.GET.get('task_id')

    
    if not query:
        return JsonResponse({'error': 'Search query is missing'}, status=400)
    if not project_id:
        return JsonResponse({'error': 'Project ID is missing'}, status=400)
    
    try:
        project = Project.objects.get(id=project_id)
        
        accepted_members = ProjectMembership.objects.filter(
            project=project,
            is_accepted=True
        ).values_list('user_id', flat=True)
        
        if task_id:
            assigned_users = TaskAssignment.objects.filter(task_id=task_id).values_list('user_id', flat=True)
            users = User.objects.filter(
                email__icontains=query,
                id__in=accepted_members
            ).exclude(id__in=assigned_users)[:10]
        else:
            users = User.objects.filter(
                email__icontains=query,
                id__in=accepted_members
            )[:10]
        
        return JsonResponse({
            'users': [
                {'email': user.email, 
                 'first_name': user.first_name, 
                 'last_name': user.last_name,
                 'picture': user.picture or '/static/profile_pictures/default_profile.jpg'
                 }
                for user in users
            ]
        })
    
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
def create_task(request, project_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            task_name = data.get('task_name')
            task_description = data.get('task_description')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            task_status = data.get('task_status')
            task_priority = data.get('task_priority')
            assigned_members = data.get('assigned_members', [])
            
            if not task_name or not start_date or not end_date:
                return JsonResponse({'status': 'error', 'message': 'Required fields are missing'}, status=400)

            project = Project.objects.get(id=project_id)
            
            task = Task.objects.create(
                task_name=task_name,
                task_description=task_description,
                start_date=start_date,
                end_date=end_date,
                task_status=task_status,
                task_priority=task_priority,
                project=project
            )

            added_users = []
            for member in assigned_members:
                user_email = member.get('email')
                if user_email:
                    try:
                        user = User.objects.get(email=user_email)
                        if ProjectMembership.objects.filter(user=user, project=project).exists():
                            TaskAssignment.objects.create(user=user, task=task)
                            added_users.append(user.email)
                            
                            Notification.objects.create(
                                user=user,
                                task=task,
                                notification_message=f"You have been assigned to task '{task.task_name}' in project '{project.project_name}'.",
                                notification_type='TASK_ASSIGNMENT'
                            )
                        else:
                            print(f"User {user.email} is not a project member.")
                    except User.DoesNotExist:
                        print(f"User with email {user_email} does not exist.")
                    except ValidationError as ve:
                        print(f"Validation error: {ve}")

            return JsonResponse({
                'status': 'success',
                'message': 'Task created successfully',
                'task_id': task.id,
                'added_users': added_users
            })

        except Project.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)
        except Exception as e:
            print('Error:', str(e))
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def update_task(request, task_id):
    user_id = request.session.get('user_id')
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            project = task.project

            is_project_owner = project.user_id == user_id
            is_project_manager = ProjectMembership.objects.filter(
                project=project, user_id=user_id, membership_role='MANAGER', is_accepted=True
            ).exists()

            is_task_assigned = TaskAssignment.objects.filter(task=task, user_id=user_id).exists()

            if not (is_project_owner or is_project_manager or is_task_assigned):
                return JsonResponse({'status': 'error', 'message': 'You are not authorized to update this task.'}, status=403)
            
            data = json.loads(request.body)
            task.task_name = data.get('task_name', task.task_name)
            task.task_description = data.get('task_description', task.task_description)
            task.start_date = data.get('start_date', task.start_date)
            task.end_date = data.get('end_date', task.end_date)
            task.task_status = data.get('task_status', task.task_status)
            task.task_priority = data.get('task_priority', task.task_priority)
            task.progress = data.get('task_progress', task.progress)
            task.save()

            return JsonResponse({'status': 'success', 'message': 'Task updated successfully'})
        
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Task not found'}, status=404)
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def update_task_status(request, task_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            status = data.get('status')
            if status not in ['TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']:
                return JsonResponse({'error': 'Invalid status'}, status=400)

            task = Task.objects.get(id=task_id)
            task.task_status = status
            task.save()

            return JsonResponse({'message': 'Task status updated successfully'})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)


def get_task_details(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task_data = {
            'id': task.id,
            'task_name': task.task_name,
            'task_description': task.task_description,
            'start_date': task.start_date.strftime('%Y-%m-%d'),
            'end_date': task.end_date.strftime('%Y-%m-%d'),
            'task_status': task.task_status,
            'task_priority': task.task_priority,
            'task_progress': task.progress
        }
        return JsonResponse({'status': 'success', 'task': task_data})
    except Task.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Task not found'}, status=404)
    


@csrf_exempt
def assign_members_to_task(request, task_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            members = data.get('members', [])

            task = get_object_or_404(Task, pk=task_id)
            project = task.project

            errors = []
            added_users = []

            for email in members:
                try:
                    user = User.objects.get(email=email)
                    if not ProjectMembership.objects.filter(user=user, project=project).exists():
                        errors.append(f"User {email} is not a member of the project.")
                        continue
                    TaskAssignment.objects.get_or_create(user=user, task=task)
                    added_users.append(email)
                except User.DoesNotExist:
                    errors.append(f"User {email} does not exist.")

            return JsonResponse({
                'status': 'success' if not errors else 'partial_success',
                'added_users': added_users,
                'errors': errors
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method'}, status=405)


def get_user_tasks(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'status': 'error', 'message': 'User not logged in'}, status=401)

    try:
        user = User.objects.get(pk=user_id)
        tasks = Task.objects.filter(
            project__user=user,
            project__is_archived=False 
        ).exclude(
            task_status__in=['COMPLETED', 'CANCELLED']
        ).select_related('project')
        
        tasks_data = [
            {
                'task_id': task.id,
                'task_name': task.task_name,
                'task_description': task.task_description,
                'end_date': task.end_date.strftime('%m/%d/%Y'),
                'task_priority': task.task_priority,
                'project_name': task.project.project_name,
                'task_progress': task.progress,
            }
            for task in tasks
        ]
        
        return JsonResponse({'status': 'success', 'tasks': tasks_data})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def kanban(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user_projects = Project.objects.filter(
        memberships__user_id=user_id,
        memberships__is_accepted=True,
        is_archived=False
    )
    context = {
        "title": "E-Hive",
        'user_projects': user_projects,
    }
    return render(request, "kanban.html", context)


@csrf_exempt
def get_completed_tasks(request, project_id):
    tasks = Task.objects.filter(project_id=project_id, task_status='COMPLETED').values('id', 'task_name')
    return JsonResponse(list(tasks), safe=False)

def get_tasks_by_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    tasks = Task.objects.filter(project=project, task_status='TO_DO')
    task_data = [
        {
            'id': task.id,
            'name': task.task_name,
            'description': task.task_description,
            'progress': task.progress,
            'assigned_to': task.taskassignment_set.first().user.first_name if task.taskassignment_set.exists() else "Unassigned",
            'profile': task.taskassignment_set.first().user.picture if task.taskassignment_set.exists() else "/static/profile_pictures/default_profile.jpg"
        }
        for task in tasks
    ]
    return JsonResponse({'tasks': task_data})


def timeline(request):
    template = "timeline.html"
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user_projects = Project.objects.filter(
        memberships__user_id=user_id,
        memberships__is_accepted=True,
        is_archived=False
    )


    context = {
        'user_projects': user_projects,
        'title': 'Timeline',
    }
    return render(request, template, context)

def archive(request):
    template = "archive.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)




def profile(request):
    template = "profile.html"
    user = User.objects.get(pk=request.session['user_id'])
    
    projects = Project.objects.filter(
        (Q(user=user)) & Q(is_archived=False)
    ).distinct().annotate(progress=Avg('tasks__progress'))
    
    context = {
        "title": "E-Hive",
        "projects": projects,
    }
    return render(request, template, context)

import os
import uuid
from django.conf import settings

def profile_edit(request):
    user_id = request.session.get('user_id')
    if user_id is None:
        return redirect('login')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return redirect('login')

    if request.method == 'POST':
        profile_form = ProfileEditForm(request.POST, request.FILES, instance=user)
        password_form = PasswordChangeForm(user, request.POST)

        # Handle Profile Picture Upload separately
        if 'profile_picture' in request.FILES:
            profile_picture = request.FILES['profile_picture']
            if profile_picture:
                upload_dir = os.path.join(settings.BASE_DIR, 'static', 'profile_pictures')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Ensure unique filename
                extension = os.path.splitext(profile_picture.name)[1]
                unique_filename = f"{uuid.uuid4().hex}{extension}"
                file_path = os.path.join(upload_dir, unique_filename)

                # Save image to static/profile_pictures/
                with open(file_path, 'wb+') as destination:
                    for chunk in profile_picture.chunks():
                        destination.write(chunk)
                
                # Update the picture field in user model
                user.picture = f"/static/profile_pictures/{unique_filename}"
                user.save()
                messages.success(request, 'Profile picture updated successfully.')

        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile_edit')

        if password_form.is_valid():
            new_password = password_form.cleaned_data['new_password1']
            user.password = make_password(new_password)
            user.save()
            messages.success(request, 'Password updated successfully.')
            return redirect('profile_edit')

    else:
        profile_form = ProfileEditForm(instance=user)
        password_form = PasswordChangeForm(user)

    return render(request, 'profile_edit.html', {
        'profile_form': profile_form,
        'password_form': password_form,
        'user_profile': user.picture or '/static/profile_pictures/default_profile.jpg'
    })


def view_proj(request, project_id):
    template = "view_proj.html"
    user_id = request.session.get('user_id')

    if not user_id:
        return redirect('login')

    project = get_object_or_404(Project, id=project_id)

    membership = ProjectMembership.objects.filter(user_id=user_id, project=project).first()
    if not membership or not membership.is_accepted:
        return redirect('project')

    tasks = Task.objects.filter(project=project).prefetch_related('task_assignments__user')
    accepted_memberships = ProjectMembership.objects.filter(project=project, is_accepted=True)

    context = {
        "title": "E-Hive",
        'project': project,
        'is_manager': membership.membership_role == 'MANAGER',
        'tasks': tasks,
        'accepted_memberships': accepted_memberships,
    }
    return render(request, template, context)

def get_project_tasks(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    tasks = Task.objects.filter(project=project).prefetch_related('task_assignments__user')

    task_list = []
    for task in tasks:
        assigned_members = [
            f"{assignment.user.first_name} {assignment.user.last_name}"
            for assignment in task.task_assignments.all()
        ]
        task_list.append({
            'id': task.id,
            'task_name': task.task_name,
            'assigned_members': assigned_members,
            'task_status': task.task_status.replace(' ', '_').lower(),
            'task_status_display': task.get_task_status_display(),
            'start_date': task.start_date.strftime('%Y-%m-%d'),
            'end_date': task.end_date.strftime('%Y-%m-%d'),
            'task_priority': task.task_priority.lower(),
            'task_priority_display': task.get_task_priority_display(),
            'progress': task.progress,  
        })
        
    print(task.task_name,
            assigned_members,
            task.task_status.replace(' ', '_').lower(),
            task.get_task_status_display(),
            task.start_date.strftime('%Y-%m-%d'),
            task.end_date.strftime('%Y-%m-%d'),
            task.task_priority.lower(),
            task.get_task_priority_display(),
            25)

    return JsonResponse({'tasks': task_list})


def get_project_tasks_gantt(request, project_id):
    """
    API endpoint to fetch tasks for a specific project.
    """
    try:
        project = Project.objects.get(id=project_id)
        user_id = request.session.get('user_id')

        if not user_id:
            return JsonResponse({'error': 'User not authenticated'}, status=403)
        
        if not ProjectMembership.objects.filter(user_id=user_id, project=project, is_accepted=True).exists():
            return JsonResponse({'error': 'User not authorized to view this project'}, status=403)

        tasks = Task.objects.filter(project=project).select_related('project')
        task_data = []
        for task in tasks:
            assigned_users = TaskAssignment.objects.filter(task=task).select_related('user')
            task_data.append({
                'id': task.id,
                'name': task.task_name,
                'start': task.start_date.isoformat(),
                'end': task.end_date.isoformat(),
                'progress': task.progress,
                'status': task.task_status,
                'priority': task.task_priority,
                'assigned_members': [f"{assign.user.first_name} {assign.user.last_name}" for assign in assigned_users],
            })

        return JsonResponse({'tasks': task_data})

    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def delete_profile(request):
    user_id = request.session.get('user_id')
    if user_id is None:
        return JsonResponse({'success': False, 'message': 'User not logged in'}, status=400)

    try:
        user = User.objects.get(id=user_id)
        user.delete()
        request.session.flush()
        return JsonResponse({'success': True, 'message': 'Profile deleted successfully'})
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    

def forgot_password(request):
    template = "forgot_password.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)
def forgot_password2(request):
    template = "forgot_password2.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)
def forgot_password3(request):
    template = "forgot_password3.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)
def forgot_password4(request):
    template = "forgot_password4.html"
    context = {
        "title" : "E-Hive",
    }
    return render(request, template, context)

def accept_invitation(request, notification_id):
    user = User.objects.get(pk=request.session['user_id'])
    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=user,
            notification_type='INVITATION'
        )
        
        membership = ProjectMembership.objects.get(
            user=user,
            project=notification.project
        )
        membership.is_accepted = True
        membership.save()
        
        notification.is_read = True
        notification.save()
        
        return JsonResponse({'success': True, 'message': 'Invitation accepted.'})
    
    except Notification.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Notification not found or not authorized.'}, status=404)
    
    except ProjectMembership.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Membership not found.'}, status=404)
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

def reject_invitation(request, notification_id):
    user = User.objects.get(pk=request.session['user_id'])
    try:
        notification = Notification.objects.get(id=notification_id, user=user, notification_type='INVITATION')
        membership = ProjectMembership.objects.get(user=user, project=notification.project)
        membership.delete()
        notification.delete()
        return JsonResponse({'success': True, 'message': 'Invitation rejected successfully.'})
    except Notification.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Notification not found.'})
    except ProjectMembership.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Membership not found.'})