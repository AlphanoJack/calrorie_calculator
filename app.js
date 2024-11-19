import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userInfoRoutes from './routes/private/user_info.js';


dotenv.config(); // process.env에 .env 파일 내용을 넣어준다.
import pageRouter from './routes/page.js';
import mongoose from "mongoose";

const app = express();
const __dirname = path.resolve();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connect error', err));

app.set('port', process.env.PORT);


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))

app.use('/api/public/auth', authRoutes);
app.use('/api/private/auth', userInfoRoutes);


app.use((err, req, res, next) => {
    console.error(err);

    const errorResponse = {
        message: err.message || '서버 내부 오류',
        status: err.status || 500,
        ...(process.env.NODE_ENV !== 'production' && {
            stack: err.stack,
            detail: err.detail,
        })
    };

    res.status(errorResponse.status).json(errorResponse);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

