from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterStep1View, RegisterStep2View, RegisterStep3View,
    DashboardView, HabitViewSet, DailyLogViewSet, DietPlanView
)

router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')
router.register(r'daily-logs', DailyLogViewSet, basename='dailylog')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/step1/', RegisterStep1View.as_view(), name='register_step1'),
    path('auth/register/step2/', RegisterStep2View.as_view(), name='register_step2'),
    path('auth/register/step3/', RegisterStep3View.as_view(), name='register_step3'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('diet-plan/', DietPlanView.as_view(), name='diet_plan'),
    path('', include(router.urls)),
]
