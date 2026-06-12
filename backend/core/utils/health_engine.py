def calculate_health_metrics(profile):
    """
    Calculates BMI, BMR, TDEE, Health Category, and Daily Macros based on UserProfile.
    """
    height_m = profile.height / 100.0
    bmi = profile.weight / (height_m ** 2)
    
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 24.9:
        category = "Normal"
    elif bmi < 29.9:
        category = "Overweight"
    else:
        category = "Obese"

    # Mifflin-St Jeor Equation for BMR
    if profile.gender == 'Male':
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    else:
        bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161

    # TDEE estimation
    multiplier = 1.2
    if profile.exercise_preference:
        multiplier += 0.3
    if profile.work_hours > 8:
        multiplier += 0.1

    tdee = bmr * multiplier

    # Adjust for goal
    if profile.goal == 'Lose':
        calorie_target = tdee - 500
    elif profile.goal == 'Gain':
        calorie_target = tdee + 500
    else:
        calorie_target = tdee

    # Macros: 30% Protein, 40% Carbs, 30% Fats
    protein_cal = calorie_target * 0.30
    carbs_cal = calorie_target * 0.40
    fats_cal = calorie_target * 0.30

    protein = protein_cal / 4
    carbs = carbs_cal / 4
    fats = fats_cal / 9

    return {
        'bmi': round(bmi, 2),
        'category': category,
        'daily_calorie_target': round(calorie_target, 2),
        'protein': round(protein, 2),
        'carbs': round(carbs, 2),
        'fats': round(fats, 2),
    }

def generate_diet_plan(user):
    from core.models import DietPlan
    profile = getattr(user, 'profile', None)
    if not profile:
        return None
        
    metrics = calculate_health_metrics(profile)
    
    diet_plan, created = DietPlan.objects.update_or_create(
        user=user,
        defaults=metrics
    )
    return diet_plan
