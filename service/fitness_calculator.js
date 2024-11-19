class FitnessCalculator {
    static calculateBasicMetrics(data) {
        try {
            const {
                height,
                weight,
                age,
                gender,
                activityLevel,
                goal
            } = data;

            // BMR 계산 (Mifflin -St Jeor 공식)

            const bmr = gender.toLowerCase() === 'male'
                ? (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) + 5
                : (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) - 161;

            const activityMultipliers = {
                sedentary: 1.2,
                lightlyActive: 1.375,
                moderatelyActive: 1.55,
                veryActive: 1.725,
                extraActive: 1.9
            };

            const tdee = bmr * (activityMultipliers[activityLevel.toLowerCase()] || 1.2);

            const goalAdjustments = {
                lose_weight: -500,
                maintain: 0,
                gain_weight: 500,
            }

            const targetCalories = tdee + (goalAdjustments[goal.toLowerCase()] || 0);

            const proteinMin = Number(weight) * 1.2;
            const proteinMax = Number(weight) * 2.2;

            return {
                success: true,
                data: {
                    bmr: Math.round(bmr),
                    tdee: Math.round(tdee),
                    targetCalories: Math.round(targetCalories),
                    recommendedProtein: {
                        min: Math.round(proteinMin),
                        max: proteinMax,
                    }
                }
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    static calculateDetailedMetrics(data) {
        try {
            const {
                height,
                weight,
                age,
                gender,
                activityLevel,
                goal,
                skeletalMuscleMass,
                bodyFatPercentage
            } = data;

            // 제지방량 계산
            const leanBodyMass = Number(weight) * (1 - (Number(bodyFatPercentage) / 100));

            // Katch-McArdle 공식을 이용한 기초대사량 계산
            const bmr = 370 + (21.6 * leanBodyMass);

            const activityMultipliers = {
                sedentary: 1.2,
                lightlyActive: 1.375,
                moderatelyActive: 1.55,
                veryActive: 1.725,
                extraActive: 1.9
            };

            const tdee = bmr * (activityMultipliers[activityLevel.toLowerCase()] || 1.2);

            const goalAdjustments = {
                lose_weight: -500,
                maintain: 0,
                gain_weight: 500
            };

            const targetCalories = tdee + (goalAdjustments[goal.toLowerCase()] || 0);

            const proteinFactor = Number(skeletalMuscleMass) / Number(weight) > 0.35 ? 2.2 : 2.0;
            const proteinMin = Number(skeletalMuscleMass) * proteinFactor;
            const proteinMax = Number(skeletalMuscleMass) * (proteinFactor + 0.4);


            return {
                success: true,
                data: {
                    bmr: Math.round(bmr),
                    tdee: Math.round(tdee),
                    targetCalories: Math.round(targetCalories),
                    recommendedProtein: {
                        min: Math.round(proteinMin),
                        max: Math.round(proteinMax)
                    },
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default FitnessCalculator;

