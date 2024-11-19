import express from 'express';
import { FitnessCalcualtor } from '../service/fitness_calculator.js'
import {authMiddleware} from "../middleware/auth.js";

const fitnessRouter = express.Router();

fitnessRouter.post('/fitness', authMiddleware, (req, res) => {
    try {
        // 필수 필드 검증
        const requiredFields = ['height', 'weight', 'age', 'gender', 'activityLevel', 'goal'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // 상세 데이터 필드 체크
        const hasDetailedData = req.body.skeletalMuscleMass && req.body.bodyFatPercentage;

        // 계산

        const reqult = hasDetailedData
            ? FitnessCalcualtor.calculateDetailedMetrics(req.body)
            : FitnessCalcualtor.calculateBasicMetrics(req.body);

        res.json(result);

    } catch (error) {

    }
});

export default fitnessRouter;