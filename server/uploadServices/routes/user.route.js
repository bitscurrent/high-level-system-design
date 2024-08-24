import { Router } from "express";
import { loginUser, logoutUser, signup } from "../controllers/user.controller.js";

const router = Router()

// Route for user registration
router.route('/signup').post(signup);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

export default router