from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="landingPage"),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name="register"),
    path('home/', views.home, name="home"),
    
    path('kanban/', views.kanban, name='kanban'),
    path('api/projects/<int:project_id>/completed-tasks/', views.get_completed_tasks, name='get_completed_tasks'),

    
    path('timeline/', views.timeline, name="timeline"),
    path('archive/', views.archive, name="archive"),
    path('profile/', views.profile, name="profile"),
    path('profile_edit/', views.profile_edit, name="profile_edit"),
    path('delete_profile/', views.delete_profile, name='delete_profile'),
    path('notification/accept/<int:notification_id>/', views.accept_invitation, name='accept_invitation'),
    path('notification/reject/<int:notification_id>/', views.reject_invitation, name='reject_invitation'),
    
    path('logout/', views.logout, name="logout"),
    path('forgot_password/', views.forgot_password, name="forgot_password"),
    path('forgot_password2/', views.forgot_password2, name="forgot_password2"),
    path('forgot_password3/', views.forgot_password3, name="forgot_password3"),
    path('forgot_password4/', views.forgot_password4, name="forgot_password4"),
    
    # PROJECT AND TASKS
    path('project/', views.project, name="project"),
    path('view_proj/<int:project_id>/', views.view_proj, name='view_proj'),
    path('create_task/<int:project_id>/', views.create_task, name='create_task'),
    path('edit-project/<int:project_id>/', views.edit_project, name='edit_project'),
    path('get-project/<int:project_id>/', views.get_project_by_id, name='get_project_by_id'),
    path('projects/<int:project_id>/add-members/', views.add_project_members, name='add_project_members'),
    path('api/users/search/', views.search_users, name='search_users'),
    path('api/tasks/<task_id>/update/', views.update_task, name='update_task'),
    path('api/tasks/<int:task_id>/update-status/', views.update_task_status, name='update_task_status'),
    path('api/task-users/search/', views.search_task_users, name='search_task_users'),
    path('tasks/<int:task_id>/assign-members/', views.assign_members_to_task, name='assign_members_to_task'),
    path('api/tasks/<int:task_id>/', views.get_task_details, name='get_task_details'),
    path('api/projects/<int:project_id>/tasks/', views.get_project_tasks, name='get_project_tasks'),
    path('api/projects-gantt/<int:project_id>/tasks/', views.get_project_tasks_gantt, name='get_project_tasks_gantt'),
    path('get-user-tasks/', views.get_user_tasks, name='get_user_tasks'),
    
    path('forgot_password/', views.forgot_password, name="forgot_password"),
    path('forgot_password2/', views.forgot_password2, name="forgot_password2"),
    path('forgot_password3/', views.forgot_password3, name="forgot_password3"),
    path('forgot_password4/', views.forgot_password4, name="forgot_password4"),
    
    path('create-project/', views.create_project, name='create_project'),
]