const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

    console.log("Received registration request:", { name, email, password });

    if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
    }
    if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }
    if (!email.includes("@")) {
    return res.status(400).json({ msg: "Invalid email format" });
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
    }

    if (name.length < 3 || name.length > 20) {
    return res.status(400).json({ msg: "Name must be between 3 and 20 characters" });
    }
    if (password.includes(" ")) {
    return res.status(400).json({ msg: "Password cannot contain spaces" });
    }
    if (email.includes(" ")) {
    return res.status(400).json({ msg: "Email cannot contain spaces" });
    }
    if (name.length < 3 || name.length > 20) {
    return res.status(400).json({ msg: "Name must be between 3 and 20 characters" });
    }

    console.log("Validation passed, checking for existing user...");

  try {
    console.log("Checking for existing user with email:", email);
    let user = await User.findOne({ email });
    console.log("User lookup complete, result:", user ? "User exists" : "No user found");
    if (user) return res.status(400).json({ msg: "User already exists" });
    
    console.log("No existing user found, proceeding with password hashing...");

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      console.error("Error hashing password");
        return res.status(500).json({ msg: "Error hashing password" });
    }
    console.log("Password hashed successfully, creating user...");
    
    user = new User({ name, email, password: hashedPassword });
    console.log("User created, saving to database...");
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name, email },
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "User already exists" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email });

  try {
    console.log("Validating email and password...");
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("User authenticated successfully, generating token...");

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
