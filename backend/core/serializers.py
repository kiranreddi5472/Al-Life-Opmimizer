from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import UserProfile, Habit, DailyLog, DietPlan

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # We use email as username if not provided
        username = validated_data.get('username') or validated_data.get('email')
        user = User.objects.create_user(
            username=username,
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name', '')
        )
        return user

class UserProfileStep2Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['age', 'gender', 'height', 'weight', 'goal']

class UserProfileStep3Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['wake_up_time', 'sleep_time', 'work_hours', 'exercise_preference']
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ['user', 'streak_count']

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'
        read_only_fields = ['user', 'date']

class DietPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlan
        fields = '__all__'
