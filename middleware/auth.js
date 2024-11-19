import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers);
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: '인증 토큰이 없습니다'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: '유효하지 않은 토큰입니다'
        });
    }
};