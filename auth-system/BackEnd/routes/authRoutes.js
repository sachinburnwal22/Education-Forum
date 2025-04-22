const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1) Does this email already exist?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with that email." });
    }

    // 2) Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Create & save the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // 4) Respond success
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user with that email." });
    }

    // 2) Compare entered password to hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3) (Optional) Generate a JWT here and send back
    //    e.g. const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // 4) Send success
    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, username: user.username, email: user.email },
      // token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

module.exports = router;
