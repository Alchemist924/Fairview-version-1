import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import commentsRouter from "./comments";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/comments", commentsRouter);

export default router;
