from django.contrib import admin
from .models import User, Project, Task, TaskAssignment, Notification, ProjectMembership

@admin.register(User)
class userAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email')
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.admin_order_field = 'first_name'
    full_name.short_description = 'Full Name' 

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'project_description', 'start_date', 'end_date', 'project_status', 'user')
    list_filter = ('project_status', 'project_priority')
    search_fields = ('project_name',)

admin.site.register(Project, ProjectAdmin)


class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'task_description', 'start_date', 'end_date', 'task_status', 'task_priority', 'project')
    list_filter = ('task_status', 'task_priority')
    search_fields = ('task_name', 'task_description', 'project__project_name')

admin.site.register(Task, TaskAdmin)


class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'task')
    search_fields = ('user__first_name', 'task__task_name')

admin.site.register(TaskAssignment, TaskAssignmentAdmin)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_message', 'notification_timestamp', 'is_read')
    list_filter = ('is_read',)
    search_fields = ('user__first_name', 'task__task_name', 'notification_message')

admin.site.register(Notification, NotificationAdmin)


class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'membership_role')
    list_filter = ('membership_role',)
    search_fields = ('user__first_name', 'project__project_name')

admin.site.register(ProjectMembership, ProjectMembershipAdmin)