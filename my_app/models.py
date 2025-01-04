from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import MinValueValidator, MaxValueValidator

# USER 
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    birthday = models.DateField()
    picture = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        default='/static/profile_pictures/default_profile.jpg'
    )

    def save(self, *args, **kwargs):
        if not self.pk or 'password' in kwargs.get('update_fields', []):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# PROJECT
class Project(models.Model):
    project_name = models.CharField(max_length=100)
    project_description = models.TextField(null=True)
    start_date = models.DateField()
    end_date = models.DateField()

    PROJECT_STATUS_CHOICES = [
        ('TO_DO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    project_status = models.CharField(max_length=20, choices=PROJECT_STATUS_CHOICES, default='TO_DO')

    PROJECT_PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]
    project_priority = models.CharField(max_length=10, choices=PROJECT_PRIORITY_CHOICES, default='MEDIUM')

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='projects')
    
    background = models.CharField(max_length=255, blank=True, null=True)

    is_archived = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None 
        super().save(*args, **kwargs)
        if is_new:

            ProjectMembership.objects.create(
                user=self.user,
                project=self,
                membership_role='MANAGER',
                is_accepted = True
            )

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be earlier than start date.")

    def __str__(self):
        return f"Project {self.id}: {self.project_name} | Owner: {self.user.first_name}"


# TASKS
class Task(models.Model):
    task_name = models.CharField(max_length=200)
    task_description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    
    TASK_STATUS_CHOICES = [
        ('TO_DO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    task_status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='TO_DO')
    
    TASK_PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]
    task_priority = models.CharField(max_length=10, choices=TASK_PRIORITY_CHOICES, default='MEDIUM')
    
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='tasks')
    
    progress = models.PositiveIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        help_text="Progress percentage of the task (0-100)."
    )

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be earlier than start date.")
        if not (0 <= self.progress <= 100):
            raise ValidationError("Progress must be between 0 and 100.")

    def __str__(self):
        return f"Task {self.id}: {self.task_name} - {self.progress}% Complete"


# TASK ASSIGNMENTS
class TaskAssignment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='task_assignments')
    task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='task_assignments')

    class Meta:
        unique_together = ('user', 'task')
        
    def clean(self):
        if not ProjectMembership.objects.filter(user=self.user, project=self.task.project).exists():
            raise ValidationError(f"User {self.user.first_name} is not a member of the project {self.task.project.project_name} and cannot be assigned to its tasks.")
        
    def __str__(self):
        return f"Assignment {self.id} - {self.user.first_name} to Task {self.task.id}"



# NOTIFICATIONS
class Notification(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notifications')
    task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    notification_message = models.TextField()
    notification_timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=50, choices=[
        ('INVITATION', 'Invitation'),
        ('UPDATE', 'Update'),
    ], default='UPDATE')

    def __str__(self):
        return f"Notification {self.id}: {self.notification_message[:20]} | Time: {self.notification_timestamp}"


# MEMBERSHIP
class ProjectMembership(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='memberships')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='memberships')
    
    MEMBERSHIP_ROLE_CHOICES = [
        ('MANAGER', 'Manager'),
        ('MEMBER', 'Member'),
    ]
    membership_role = models.CharField(max_length=20, choices=MEMBERSHIP_ROLE_CHOICES, default='MEMBER')
    
    # New field for invitations
    is_accepted = models.BooleanField(default=False)
    
    def __str__(self):
        status = "Accepted" if self.is_accepted else "Pending"
        return f"Membership {self.id}: {self.user.first_name} ({self.membership_role}) in {self.project.project_name} - {status}"
