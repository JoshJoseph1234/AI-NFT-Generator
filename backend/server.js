const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Simple Test Route (Check If Server is Working)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// POST API to Create a New User
app.post("/api/users", (req, res) => {
    console.log("Received Request:", req.body); // Debugging log
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
  
    const newUser = new User({ name, email });
  
    newUser.save()
      .then((user) => {
        res.status(201).json({ message: "User created", user });
      })
      .catch((error) => {
        console.error("Error details:", error); // Log detailed error to the console
        res.status(500).json({ message: "Error creating user", error: error.message });
      });
  });
  

// Route to get all users from the database
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Get all users from the User collection
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    res.status(500).json({ message: "Error fetching users" });
  }
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/yourDBName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Set timeout to 50 seconds
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
