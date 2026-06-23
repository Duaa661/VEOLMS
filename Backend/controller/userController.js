import bcrypt from "bcryptjs";
import User from "../model/usermodel.js";
import validator from "validator";
import { generateToken } from "../config/token.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({message:"Enter Valid Email"})
    }
    if (password.length < 8) {
      return res.status(400).json({message:"Enter Strong Password"})
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    // create a token
    let token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge:7 * 24 * 60 * 60 * 1000
    })
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error ${error}`,
    });
  }
};

// Login Controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};


// logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};