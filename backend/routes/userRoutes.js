const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create a user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
