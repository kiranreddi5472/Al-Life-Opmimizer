from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField(validators=[MinValueValidator(10), MaxValueValidator(100)])
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    height = models.FloatField(validators=[MinValueValidator(100.0), MaxValueValidator(250.0)]) # in cm
    weight = models.FloatField(validators=[MinValueValidator(30.0), MaxValueValidator(200.0)]) # in kg
    goal = models.CharField(max_length=20, choices=[('Lose', 'Lose'), ('Gain', 'Gain'), ('Maintain', 'Maintain')])
    wake_up_time = models.TimeField(null=True, blank=True)
    sleep_time = models.TimeField(null=True, blank=True)
    work_hours = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(16.0)], null=True, blank=True)
    exercise_preference = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Habit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=255)
    streak_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('habit', 'date')

    def __str__(self):
        return f"{self.habit.name} on {self.date}"

class DailyLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    sleep_hours = models.FloatField(null=True, blank=True)
    screen_time = models.FloatField(null=True, blank=True)
    mood = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    water_intake = models.FloatField(null=True, blank=True) # e.g. liters
    calories = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"Log for {self.user.username} on {self.date}"

class DietPlan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='diet_plan')
    bmi = models.FloatField()
    category = models.CharField(max_length=50)
    daily_calorie_target = models.FloatField()
    protein = models.FloatField() # grams
    carbs = models.FloatField() # grams
    fats = models.FloatField() # grams

    def __str__(self):
        return f"Diet Plan for {self.user.username}"
