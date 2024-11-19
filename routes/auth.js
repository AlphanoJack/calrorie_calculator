import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {authMiddleware} from "../middleware/auth.js";

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, name, nickname } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'already used email'
            });
        }

        const user = new User({
            email,
            password,
            name,
            nickname
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        res.status(201).json({
            success: true,
            data: {
                userId: user._id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                token
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 로그인

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'email is wrong'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'password is wrong'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        res.json({
            success:true,
            data: {
                userId: user._id,
                email: user.email,
                name: user.name,
                nickname: user.usernickname,
                token
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// router.get('/me', authMiddleware, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.userId)
//             .select('-password');
//
//         // 토큰 디코딩
//         const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);
//         const issuedAt = decoded.iat * 1000;  // 토큰 발급 시간 (초 -> 밀리초)
//         const currentTime = Date.now();
//
//         // 발급 시간으로부터 24시간 초과 확인
//         const ONE_DAY = 24 * 60 * 60 * 1000;
//         if (currentTime - issuedAt > ONE_DAY) {
//             // 24시간 초과시 새 토큰 발급
//             const newToken = jwt.sign(
//                 { userId: user._id },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '14d' }
//             );
//
//             return res.json({
//                 success: true,
//                 data: {
//                     user,
//                     token: newToken
//                 }
//             });
//         }
//
//         // 24시간 이내면 기존 응답
//         res.json({
//             success: true,
//             data: { user }
//         });
//     } catch (error){
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// });

export default router;