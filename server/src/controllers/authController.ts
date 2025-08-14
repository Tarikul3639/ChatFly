import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
    }

    // TODO: Check if user already exists
    // TODO: Hash password
    // TODO: Create user in database

    // For now, return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // TODO: Find user in database
    // TODO: Verify password
    // TODO: Generate JWT token

    // For now, generate a mock token
    const token = jwt.sign(
      { userId: "mock-user-id", email },
      config.get("jwt.secret") || "fallback-secret",
      { expiresIn: config.get("jwt.expiresIn") || "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          email,
          username: "Mock User",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // TODO: Invalidate token (add to blacklist)
    
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // TODO: Get user from database using req.user.id
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: "mock-user-id",
          username: "Mock User",
          email: "mock@example.com",
          createdAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, avatar } = req.body;

    // TODO: Update user in database
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          username: username || "Mock User",
          avatar,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
