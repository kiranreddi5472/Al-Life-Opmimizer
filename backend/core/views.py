from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    UserSerializer, 
    UserProfileStep2Serializer, 
    UserProfileStep3Serializer,
    HabitSerializer,
    DailyLogSerializer,
    DietPlanSerializer
)
from .utils.health_engine import generate_diet_plan
from .utils.intelligence import analyze_user_data
from .models import Habit, DailyLog, DietPlan, HabitLog
from rest_framework import viewsets
from rest_framework.decorators import action
from django.utils import timezone

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterStep1View(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': serializer.data,
                'tokens': tokens,
                'message': 'Step 1 complete. User created.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterStep2View(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        # If profile exists, we update it, otherwise create
        if hasattr(user, 'profile'):
            serializer = UserProfileStep2Serializer(user.profile, data=request.data, partial=True)
        else:
            serializer = UserProfileStep2Serializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({'message': 'Step 2 complete. Profile updated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterStep3View(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'profile'):
            return Response({'error': 'Please complete Step 2 first.'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = UserProfileStep3Serializer(user.profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Generate Diet Plan
            generate_diet_plan(user)
            return Response({'message': 'Registration complete. Diet plan generated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        intelligence_data = analyze_user_data(user)
        
        diet_plan = getattr(user, 'diet_plan', None)
        diet_data = DietPlanSerializer(diet_plan).data if diet_plan else None

        habits = Habit.objects.filter(user=user)
        habit_data = HabitSerializer(habits, many=True).data

        return Response({
            'intelligence': intelligence_data,
            'diet_plan': diet_data,
            'habits': habit_data,
            'profile_complete': hasattr(user, 'profile')
        }, status=status.HTTP_200_OK)

class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def log(self, request, pk=None):
        habit = self.get_object()
        completed = str(request.data.get('completed', 'true')).lower() == 'true'
        today = timezone.now().date()
        
        habit_log, created = HabitLog.objects.update_or_create(
            habit=habit, date=today,
            defaults={'completed': completed}
        )
        
        # Simple streak update (real logic might be more complex)
        if completed and created:
            habit.streak_count += 1
        elif not completed:
            habit.streak_count = 0
        habit.save()
        
        return Response({'message': 'Habit logged', 'streak': habit.streak_count}, status=status.HTTP_200_OK)

class DailyLogViewSet(viewsets.ModelViewSet):
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyLog.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DietPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        diet = getattr(request.user, 'diet_plan', None)
        if diet:
            return Response(DietPlanSerializer(diet).data)
        return Response({'error': 'No diet plan found.'}, status=status.HTTP_404_NOT_FOUND)

class DietPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        diet = getattr(request.user, 'diet_plan', None)
        if diet:
            return Response(DietPlanSerializer(diet).data)
        return Response({'error': 'No diet plan found.'}, status=status.HTTP_404_NOT_FOUND)