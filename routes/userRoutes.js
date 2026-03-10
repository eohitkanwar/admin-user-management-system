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
router.post('/register',registerUser);
router.post('/login',userValidation, loginUser);
router.post('/forgot-password', userValidation ,forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

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

// GET test endpoint for browser access
router.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      email: 'test@example.com',
      subject: 'Test Email (GET)',
      message: 'This is a test email from GET request',
      html: '<h1>Test Email</h1><p>This is a test email from the system (GET request).</p>'
    });
    res.json({ success: true, message: 'Test email sent via GET' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: 'Test email failed', error: error.message });
  }
});

export default router;