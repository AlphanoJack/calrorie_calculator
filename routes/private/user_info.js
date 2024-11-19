import {authMiddleware} from "../../middleware/auth.js";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password');

        // 토큰 디코딩
        const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);
        const issuedAt = decoded.iat * 1000;  // 토큰 발급 시간 (초 -> 밀리초)
        const currentTime = Date.now();

        // 발급 시간으로부터 24시간 초과 확인
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (currentTime - issuedAt > ONE_DAY) {
            // 24시간 초과시 새 토큰 발급
            const newToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '14d' }
            );

            return res.json({
                success: true,
                data: {
                    user,
                    token: newToken
                }
            });
        }

        // 24시간 이내면 기존 응답
        res.json({
            success: true,
            data: { user }
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

export default router;