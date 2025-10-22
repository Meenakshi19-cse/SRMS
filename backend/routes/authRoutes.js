import express from "express";
import { login,getUserDetails,updateUserProfile,forgotPassword, resetPassword} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/get-user/:id", getUserDetails);
router.put("/update-profile/:userId", updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;