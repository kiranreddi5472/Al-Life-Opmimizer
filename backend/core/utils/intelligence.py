import pandas as pd
import numpy as np
from datetime import timedelta
from django.utils import timezone
from core.models import DailyLog, HabitLog

def analyze_user_data(user):
    """
    Analyzes the last 7 days of data to generate scores and insights using Pandas.
    """
    today = timezone.now().date()
    seven_days_ago = today - timedelta(days=7)

    # Fetch Data
    logs_qs = DailyLog.objects.filter(user=user, date__gte=seven_days_ago, date__lte=today).values()
    habit_logs_qs = HabitLog.objects.filter(habit__user=user, date__gte=seven_days_ago, date__lte=today).values()

    if not logs_qs:
        return {
            'scores': {
                'sleep_score': 0,
                'screen_score': 0,
                'habit_score': 0,
                'overall_score': 0
            },
            'status': 'Insufficient Data',
            'insights': ['Please log your daily activities for at least a few days to generate insights.']
        }

    df_logs = pd.DataFrame(list(logs_qs))
    
    # Fill missing with safe defaults for calculations
    df_logs.fillna({
        'sleep_hours': 7.0,
        'screen_time': 4.0,
        'mood': 3,
        'water_intake': 2.0,
        'calories': getattr(getattr(user, 'diet_plan', None), 'daily_calorie_target', 2000)
    }, inplace=True)

    # 1. Sleep Score
    def calc_sleep_score(hours):
        if 7 <= hours <= 9:
            return 100
        elif 6 <= hours < 7 or 9 < hours <= 10:
            return 75
        elif 5 <= hours < 6:
            return 50
        else:
            return 25
    
    df_logs['sleep_score'] = df_logs['sleep_hours'].apply(calc_sleep_score)
    avg_sleep_score = df_logs['sleep_score'].mean()

    # 2. Screen Time Score
    def calc_screen_score(hours):
        if hours <= 3:
            return 100
        elif hours <= 5:
            return 70
        elif hours <= 8:
            return 40
        else:
            return 10
            
    df_logs['screen_score'] = df_logs['screen_time'].apply(calc_screen_score)
    avg_screen_score = df_logs['screen_score'].mean()

    # 3. Habit Consistency Score
    avg_habit_score = 0
    if habit_logs_qs:
        df_habits = pd.DataFrame(list(habit_logs_qs))
        completion_rate = df_habits['completed'].mean()
        avg_habit_score = completion_rate * 100
    else:
        avg_habit_score = 50

    # 4. Overall Health Score
    overall_score = (avg_sleep_score * 0.35) + (avg_habit_score * 0.35) + (avg_screen_score * 0.30)
    
    status = "Poor"
    if overall_score >= 80:
        status = "Good"
    elif overall_score >= 50:
        status = "Average"

    # Smart Insights & Pattern Analysis
    insights = []
    
    recent_logs = df_logs.sort_values('date').tail(3)
    older_logs = df_logs.sort_values('date').head(4) if len(df_logs) > 3 else pd.DataFrame()

    if len(recent_logs) >= 3 and len(older_logs) > 0:
        if recent_logs['mood'].mean() < older_logs['mood'].mean():
            insights.append("Your mood has been trending downward recently. Consider taking a break or adjusting your routine.")
            
    if df_logs['sleep_hours'].mean() < 6 and df_logs['screen_time'].mean() > 6:
        insights.append("High screen time might be causing your low sleep duration. Try to reduce device usage before bed.")
    
    if avg_habit_score < 40 and df_logs['mood'].mean() < 3:
        insights.append("Low habit consistency seems to correlate with a lower mood. Try focusing on just one easy habit tomorrow.")

    if avg_sleep_score >= 80 and avg_habit_score >= 80:
        insights.append("You are doing great! Consistent habits and good sleep are paying off.")

    if not insights:
        insights.append("Keep tracking your data to see more advanced insights.")

    return {
        'scores': {
            'sleep_score': round(avg_sleep_score),
            'screen_score': round(avg_screen_score),
            'habit_score': round(avg_habit_score),
            'overall_score': round(overall_score)
        },
        'status': status,
        'insights': insights
    }
