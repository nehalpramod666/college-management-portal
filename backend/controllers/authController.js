const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------------------
// Generate JWT Token
// ---------------------------
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ---------------------------
// REGISTER USER
// ---------------------------
const registerUser = async (req, res) => {
  try {
    console.log("===== REGISTER HIT =====");
    console.log(req.body);

    const { name, email, password, role } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("USER ALREADY EXISTS");

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // rest of your existing code...

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------
// LOGIN USER
// ---------------------------
const loginUser = async (req, res) => {
  try {
    console.log("===== LOGIN HIT =====");
    console.log(req.body);

    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};