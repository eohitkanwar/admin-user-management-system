import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "./email.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("existinguser",existingUser)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error : "User already exists with email" ,
        message: "User already exists with this email",
      });
    }


    // 🔐 Assign role (DEV logic)
    const role = email === "admin@yopmail.com" ? "admin" : "user";

    console.log("role", role);

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "MyAPP_Rohit", {
      expiresIn: "7d",
    });

    // Send welcome email with credentials
    console.log("🔔 EMAIL SENDING: Starting email sending process for:", user.email);
    console.log("🔔 EMAIL SENDING: sendEmail function available:", typeof sendEmail);
    try {
      console.log("🔔 EMAIL SENDING: About to call sendEmail...");
      await sendEmail({
        email: user.email,
        subject: "Welcome! Your Account Has Been Created",
        message: `Dear ${user.username},\n\nYour account has been successfully created. Here are your login credentials:\n\nUsername: ${user.username}\nEmail: ${user.email}\nPassword: ${password}\nRole: ${user.role}\n\nLogin URL: http://localhost:3000/login\n\nSecurity Notice: Please keep your credentials secure and change your password after first login.\n\nIf you have any questions or need assistance, please contact our support team.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Welcome to Our System!</h2>
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Account Details:</h3>
              <p><strong>Username:</strong> ${user.username}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Role:</strong> ${user.role}</p>
            </div>
            
            <p><strong>Login URL:</strong> <a href="http://localhost:3000/login" style="color: #007bff;">http://localhost:3000/login</a></p>
            
            <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Security Notice:</strong> Please keep your credentials secure and change your password after first login.</p>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      console.log("✅ Welcome email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
      console.error("❌ Email error details:", emailError.message);
      // Continue with registration even if email fails
    }

    // Response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
    console.log("user created",user)
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// @route   POST /api/auth/login
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

    console.log("isUserExist", users);
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

    const token = jwt.sign(payload, process.env.JWT_SECRET || "MyAPP_Rohit", {
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
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

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

    const { resettoken } = req.params;
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
    // Check if pagination parameters are provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const usePagination = req.query.page || req.query.limit;
    const search = req.query.search || "";

    if (usePagination) {
      // Pagination logic
      const skip = (page - 1) * limit;
      
      // Build search query
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } }
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

      return res.status(200).json({
        success: true,
        count: users.length,
        totalUsers,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        users,
      });
    } else {
      // Original format for backward compatibility
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } }
          ]
        };
      }
      
      const users = await User.find(searchQuery).select("-password");

      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    }
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
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

    // ❌ Admin khud ko delete na kar sake (optional but recommended)
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete himself",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
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

// @desc    Create user by admin
// @route   POST /api/auth/create-user
// @access  Private (Admin only)
export const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Set role (default to 'user' if not specified)
    const userRole = role || 'user';

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: userRole,
    });

    // Send welcome email with credentials
    console.log("Attempting to send welcome email to:", user.email);
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome! Your Account Has Been Created",
        message: `Dear ${user.username},\n\nYour account has been successfully created. Here are your login credentials:\n\nUsername: ${user.username}\nEmail: ${user.email}\nPassword: ${password}\nRole: ${user.role}\n\nLogin URL: http://localhost:3000/login\n\nSecurity Notice: Please keep your credentials secure and change your password after first login.\n\nIf you have any questions or need assistance, please contact our support team.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Welcome to Our System!</h2>
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Account Details:</h3>
              <p><strong>Username:</strong> ${user.username}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Role:</strong> ${user.role}</p>
            </div>
            
            <p><strong>Login URL:</strong> <a href="http://localhost:3000/login" style="color: #007bff;">http://localhost:3000/login</a></p>
            
            <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Security Notice:</strong> Please keep your credentials secure and change your password after first login.</p>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      console.log("✅ Welcome email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
      console.error("❌ Email error details:", emailError.message);
      // Continue with user creation even if email fails
    }

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully! Welcome email sent.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during user creation",
    });
  }
};

// Export all auth controller functions
