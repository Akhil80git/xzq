const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- STATIC FRONTEND ---------- */
app.use(express.static("public"));

/* ---------- MONGODB CONNECT ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ---------- SCHEMA ---------- */
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

/* ---------- ROUTES ---------- */

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", env: process.env.NODE_ENV });
});

// save message
app.post("/save", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        msg: "Message is required",
      });
    }

    await Message.create({ message });

    res.json({
      success: true,
      msg: "Saved to MongoDB",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
});

/* ---------- SERVER START ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
