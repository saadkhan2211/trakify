import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });

  const assignedRole = role === "admin" ? "admin" : "viewer";

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered." });

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });
    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const seedUsers = async (req, res) => {
  try {
    const seeds = [
      {
        name: "Admin User",
        email: "admin@trakify.io",
        password: "admin123",
        role: "admin",
      },
      {
        name: "View Only",
        email: "viewer@trakify.io",
        password: "viewer123",
        role: "viewer",
      },
    ];

    const results = [];
    for (const seed of seeds) {
      const exists = await User.findOne({ email: seed.email });
      if (!exists) {
        const u = await User.create(seed);
        results.push({ created: true, email: u.email, role: u.role });
      } else {
        results.push({
          created: false,
          email: exists.email,
          role: exists.role,
        });
      }
    }

    res.json({ message: "Seed complete.", results });
  } catch (err) {
    res.status(500).json({ message: "Seed failed.", error: err.message });
  }
};
