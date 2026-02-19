import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  changePassword,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateProfile,
  createUserByAdmin

} from '../controllers/authController.js';
import { getAllUsers,updateUser, getUserById } from "../controllers/authController.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import sendEmail from '../controllers/email.js';

const router = express.Router();

// Public routes
// routes/authRoutes.js
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.post("/create-user", protect, adminOnly, createUserByAdmin);
router.post("/users", protect, adminOnly, createUserByAdmin); // Alternative endpoint
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);


router.put("/profile", protect, updateProfile);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    await sendEmail({
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email',
      html: '<h1>Test Email</h1><p>This is a test email from the system.</p>'
    });
    res.json({ success: true, message: 'Test email sent' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: 'Test email failed', error: error.message });
  }
});

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;