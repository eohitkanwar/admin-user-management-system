import express from 'express';
import { userValidation } from '../validators/userValidator.js';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  changePassword,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateProfile,
  getUserActivities ,
} from '../controllers/authController.js';
import { getAllUsers,updateUser, getUserById } from "../controllers/authController.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import sendEmail from '../controllers/email.js';

const router = express.Router();

// Public routes
// routes/authRoutes.js
router.get("/users", protect, adminOnly,userValidation,  getAllUsers);
router.get("/users/:id", protect, adminOnly,userValidation, getUserById);
router.post("/create-user", protect, adminOnly,userValidation, registerUser);
router.post("/users", protect, adminOnly,userValidation, registerUser); // Alternative endpoint
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly,userValidation,  deleteUser);

router.put("/profile", protect, updateProfile);

// Public authentication routes
router.post('/register', userValidation, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password',forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// User history route
router.get('/user-history', protect, adminOnly, getUserActivities );

// GET test endpoint for browser access
app.get("/test-brevo", async (req, res) => {
  console.log("KEY:", process.env.BREVO_API_KEY);
  res.send("Check console");
});
export default router;