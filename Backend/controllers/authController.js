const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { formatUser } = require("../utils/formatHelper");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Perform case‑insensitive checks so that email/username variations are treated as duplicates
    const emailExists = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
    const usernameExists = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Wrap user creation in its own try/catch to handle duplicate‑key errors that may slip through the earlier checks
    try {
      const user = await User.create({
        name: fullName,
        username,
        email,
        password: hashedPassword,
        joinDate:
          "Joined " +
          new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      });

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: { ...formatUser(user, user._id), email: user.email },
      });
    } catch (err) {
      if (err.code === 11000) {
        const duplicateKey = Object.keys(err.keyPattern)[0];
        const friendlyName = duplicateKey === "email" ? "Email" : "Username";
        return res.status(400).json({ message: `${friendlyName} already registered` });
      }
      return res.status(500).json({ message: err.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });

    if (!user)
      return res.status(400).json({ message: "Invalid Credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: { ...formatUser(user, user._id), email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// GET CURRENT USER (/me)
// =========================
exports.getMe = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ ...formatUser(user, id), email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// LOGOUT
// =========================
exports.logout = async (req, res) => {
  res.json({ success: true });
};