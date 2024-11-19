import express from "express";

const router = express.Router();
import { renderJoin, renderMain, renProfile } from '../controllers/page.js';

router.use((req, res, next) => {
   res.locals.user = null;
   res.locals.follwerCount = 0;
   res.locals.followingCount = 0;
   res.locals.followingIDList = [];
   next();
});

router.get('/join', renderJoin);

router.get('/', renderMain);

export default router;