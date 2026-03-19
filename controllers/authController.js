import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import sendEmail from "./email.js";
import Activity from "../models/Activity.js";


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ 1. Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ✅ 3. Assign role
    const role = email === "admin@yopmail.com" ? "admin" : "user";

    // ✅ 4. Admin info (for tracking)
    let adminInfo = {};
    if (req.user && req.user.role === "admin") {
      adminInfo = {
        createdBy: req.user.id,
      };
    }

    // ✅ 5. Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      ...adminInfo,
    });

    // ✅ 6. Create Activity Log (IMPORTANT 🔥)
    // Only create activity if an admin is creating the user
    if (req.user && req.user.role === "admin") {
      try {
        await Activity.create({
          action: "USER_CREATED",
          description: `Admin ${req.user.username} created user ${user.username}`,
          performedBy: req.user.id,
          targetUser: user._id,
        });
        console.log("✅ Activity log created for user creation by admin:", req.user.username);
      } catch (err) {
        console.log("❌ Activity log failed:", err.message);
      }
    }

    // ✅ 7. Create JWT
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.JWT_SECRET || "MYAPP_Rohit_2026_Secure_Key",
      { expiresIn: "7d" }
    );

    // ✅ 8. Send response FIRST
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "User registered successfully",
    });

    // ✅ 9. Send Email in Background (NON-BLOCKING 🚀)
    sendEmail({
      email: user.email,
      subject: "Welcome! Your Account Has Been Created",
      message: `Username: ${user.username}\nEmail: ${user.email}\nPassword: ${password}`,
    })
      .then((res) => console.log("Email sent:", res?.messageId))
      .catch((err) => console.log("Email error:", err.message));

  } catch (error) {
    console.error("Registration error:", error);

    // ✅ Validation Error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    // ✅ Duplicate Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // ✅ Default Error
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};// @route   POST /api/auth/login
// @access  Public
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body); // Add this for debugging

    const { email, password } = req.body;

    const bodyData = req.body;

    // Validate input
    if (!email || !password) {
      console.log("Email And Password Is Required");
      console.log("receivedData", req.body);
      return res.status(400).json({
        success: false,
        message: "Email And Password Is Required",
        receivedData: req.body,
      });
    }
    // Check if user exists
    const users = await User.findOne({ email: bodyData.email });

    console.log("🔍 Login Debug - Email searched:", bodyData.email);
    console.log("🔍 Login Debug - User found:", users ? 'YES' : 'NO');
    if (users) {
        console.log("🔍 Login Debug - User ID:", users._id);
        console.log("🔍 Login Debug - User Role:", users.role);
        console.log("🔍 Login Debug - User Email:", users.email);
    }
    if (!users) {
      console.log("User Not Exist Kindly Register Your Account");
      return res.status(401).json({
        success: false,
        message: "User Not Exist Kindly Register Your Account",
      });
    }
    console.log("password", password);
    // Check password
    const isMatch = await users.comparePassword(password);
    console.log("itMatch", isMatch);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const payload = {
      user: {
        id: users.id,
        role: users.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "MYAPP_Rohit_2026_Secure_Key", {
      expiresIn: "7d",
    });
    console.log("token", token);
    // Remove password from output
    users.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: users._id,
        username: users.username,
        email: users.email,
        role: users.role,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
}; // @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("reqbody", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiry (10 minutes)
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `https://admin-user-management-system-frontend.onrender.com/reset-password/${resetToken}`;

    console.log("reseturl", resetUrl);

    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 10 minutes.</p>`,
      });
      console.log("====", sendEmail);
      console.log("SAVED HASH TOKEN:", user.resetPasswordToken);
      console.log("EXPIRE AT:", user.resetPasswordExpire);

      res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (err) {
      console.log("email error", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    console.log("URL TOKEN:", req.params.resettoken);

    const resettoken = req.params.resettoken;
    const { password } = req.body;
    console.log("resettoken", resettoken);
    console.log("password", password);

    if (!resettoken) {
      console.log("reset token is required");
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    // Get hashed token
    const hashedIncoming = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");

    console.log("INCOMING HASH:", hashedIncoming);

    const user = await User.findOne({
      resetPasswordToken: hashedIncoming,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token used:", resettoken);
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired token. Please request a new password reset.",
      });
    }

    // Update user's password and clear reset token
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Set new password
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Create token

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    // Add cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Check if pagination parameters are provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const usePagination = req.query.page || req.query.limit;
    const search = req.query.search || "";

    console.log("🔍 getAllUsers called with:", { page, limit, usePagination, search });

    if (usePagination) {
      // Pagination logic
      const skip = (page - 1) * limit;
      
      // Build search query
      let searchQuery = {};
      if (search && search.trim()) {
        searchQuery = {
          $or: [
            { username: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
            { role: { $regex: search.trim(), $options: 'i' } }
          ]
        };
      }
      
      const totalUsers = await User.countDocuments(searchQuery);
      
      const users = await User.find(searchQuery)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalUsers / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log("✅ Users fetched successfully:", users.length, "users");

      return res.status(200).json({
        success: true,
        count: users.length,
        totalUsers,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        users,
        timestamp: new Date().toISOString(), // Add timestamp to prevent caching
      });
    } else {
      // Original format for backward compatibility
      let searchQuery = {};
      if (search && search.trim()) {
        searchQuery = {
          $or: [
            { username: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
            { role: { $regex: search.trim(), $options: 'i' } }
          ]
        };
      }
      
      const users = await User.find(searchQuery).select("-password");

      console.log("✅ Users fetched successfully (no pagination):", users.length, "users");

      res.status(200).json({
        success: true,
        count: users.length,
        users,
        timestamp: new Date().toISOString(), // Add timestamp to prevent caching
      });
    }
  } catch (error) {
    console.error("❌ Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/auth/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("🔍 getUserById called with userId:", userId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find user by ID
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.username, user.email);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;

    // Check if username is being updated and if it already exists
    if (username) {
      const existingUser = await User.findOne({ 
        username: username,
        _id: { $ne: userId } // Exclude current user from check
      });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "USERNAME_EXISTS",
          message: "Username is already assigned to another user account. Username must be unique across the system."
        });
      }
    }

    // Check if email is being updated and if it already exists
    if (email) {
      const existingEmail = await User.findOne({ 
        email: email,
        _id: { $ne: userId } // Exclude current user from check
      });
      
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email conflict: The specified email address is already registered in the system. Each email must be unique.",
        });
      }
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Create activity log for user update
    try {
      const changes = [];
      if (req.body.username && req.body.username !== user.username) {
        changes.push(`username to ${req.body.username}`);
      }
      if (req.body.email && req.body.email !== user.email) {
        changes.push(`email to ${req.body.email}`);
      }
      if (req.body.role && req.body.role !== user.role) {
        changes.push(`role to ${req.body.role}`);
      }
      
      const changeDescription = changes.length > 0 ? changes.join(', ') : 'profile information';
      
      await Activity.create({
        action: "USER_UPDATED",
        description: `Admin ${req.user.username} updated ${user.username}'s ${changeDescription}`,
        performedBy: req.user.id,
        targetUser: user._id,
      });
      console.log("✅ Activity log created for user update");
    } catch (err) {
      console.log("❌ Activity log failed for user update:", err.message);
    }
    
    console.log("user", user);
    res.status(200).json({
      success: true,
      user,
      message: "Updated successfully"
    });

  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// @desc    Delete user (ADMIN only)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("🗑️ DELETE USER - userID:", userId);
    console.log("🗑️ DELETE USER - req.user.id:", req.user.id);
    console.log("🗑️ DELETE USER - Request received");

    // ❌ Admin khud ko delete na kar sake (optional but recommended)
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete himself",
      });
    }

    console.log("🗑️ DELETE USER - Finding user in database...");
    console.log("🗑️ DELETE USER - Database connection state:", mongoose.connection.readyState);
    console.log("🗑️ DELETE USER - Database name:", mongoose.connection.name);
    
    const user = await User.findById(userId);
    console.log("🗑️ DELETE USER - Query result:", user ? 'FOUND' : 'NOT FOUND');
    
    if (user) {
      console.log("🗑️ DELETE USER - Found user details:", {
        id: user._id,
        username: user.username,
        email: user.email
      });
    }

    if (!user) {
      console.log("❌ DELETE USER - User not found in database");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ DELETE USER - User found:", user.username, user.email);
    console.log("🗑️ DELETE USER - Deleting user...");
    
    // Create activity log before deletion
    try {
      await Activity.create({
        action: "USER_DELETED",
        description: `Admin ${req.user.username} deleted user ${user.username}`,
        performedBy: req.user.id,
        targetUser: user._id,
      });
      console.log("✅ Activity log created for user deletion");
    } catch (err) {
      console.log("❌ Activity log failed for user deletion:", err.message);
    }
    
    await User.findByIdAndDelete(userId);

    console.log("✅ DELETE USER - User deleted successfully");
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    console.log("updateUser" ,updatedUser)

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get user creation history
// @route   GET /api/auth/user-history
// @access  Private (Admin only)
export const getUserActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", action = "" } = req.query;

    // Build search query
    let query = {};
    
    // Add action filter if specified
    if (action && action.trim()) {
      query.action = action.trim();
    }
    
    // Add search filter if search is provided
    if (search && search.trim()) {
      query.$or = [
        { action: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const activities = await Activity.find(query)
      .populate("performedBy", "username email role")
      .populate("targetUser", "username email role")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    // 👇 Clean response (VERY IMPORTANT)
    const formatted = activities.map((item) => ({
      _id: item._id,
      action: item.action,
      description: item.description,
      timestamp: item.createdAt,

      performedBy: {
        name: item.performedBy?.username || 'Unknown',
        email: item.performedBy?.email || 'N/A',
        role: item.performedBy?.role || 'N/A'
      },

      targetUser: {
        name: item.targetUser?.username || 'Unknown',
        email: item.targetUser?.email || 'N/A',
        role: item.targetUser?.role || 'N/A'
      }
    }));

    // Get counts for each action type
    const [createdCount, updatedCount, deletedCount] = await Promise.all([
      Activity.countDocuments({ action: "USER_CREATED" }),
      Activity.countDocuments({ action: "USER_UPDATED" }),
      Activity.countDocuments({ action: "USER_DELETED" })
    ]);

    res.json({
      success: true,
      activities: formatted,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalActivities: total,
      actionCounts: {
        USER_CREATED: createdCount,
        USER_UPDATED: updatedCount,
        USER_DELETED: deletedCount
      }
    });

  } catch (error) {
    console.error("Error in getUserActivities:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error while fetching activities" 
    });
  }
};
export const createActivity = async ({ action, description, performedBy, targetUser }) => {
  try {
    await Activity.create({
      action,
      description,
      performedBy,
      targetUser
    });
  } catch (error) {
    console.log("Activity log error:", error);
  }
};

// @desc    Create user by admin
// @route   POST /api/auth/create-user
// @access  Private (Admin only)
