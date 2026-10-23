import { Router, type IRouter } from "express";
import healthRouter from "./health";
import faroRouter from "./faro";

const router: IRouter = Router();

router.use(healthRouter);
router.use(faroRouter);

export default router;
