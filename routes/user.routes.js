import express from "express";
import userControllers from "../controllers/user.controllers.js";
const router = express.Router();

router.get("/signup", userControllers.signupGet);
router.post("/signup", userControllers.signupSend);
router.get("/login", userControllers.loginGet);
router.post("/login", userControllers.loginSend);
router.get("/logout", userControllers.logoutGet);

export default router;
