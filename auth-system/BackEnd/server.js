const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS setup: allow requests from your Vercel frontend
app.use(
  cors({
    origin:
      "https://education-forum-git-main-burnwallucky2-gmailcoms-projects.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
console.log("Mongo URI is:", process.env.MONGO_URI);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));
