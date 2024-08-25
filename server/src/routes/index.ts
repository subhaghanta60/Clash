import { Router } from "express";
import AuthRoutes from "./authRoutes.js"
import VerifyRoutes from "./verifyRoutes.js"
import ClashRoutes from "./clashRoutes.js"
import authmiddleware from "../middleware/AuthMiddleware.js";

const router = Router();


router.use("/api/auth", AuthRoutes)
router.use("/",VerifyRoutes)
router.use("/api/clash",authmiddleware, ClashRoutes)



export default router