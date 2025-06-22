const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { exec } = require('child_process');
require("dotenv").config();
const cron = require('node-cron');

const app = express();
const PORT = 3200;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schema
const promptSchema = new mongoose.Schema({
  url: { type: String, unique: true },
  title: String,
  prompt: String,
  tags: [
    {
      name: String,
      url: String,
    },
  ],
  images: {
    original: String,
    sizes: Object,
  },
});

const Prompt = mongoose.model("Prompt", promptSchema);

app.get("/",(req,res)=>res.send("server is up!"))
app.get('/api/logs', async (req, res) => {
  try {
    // Count prompts with at least one image
    const totalImages = await Prompt.countDocuments();
    return res.send(totalImages);

  } catch (err) {
    console.error("❌ Error in /api/logs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// API Endpoint to Save
app.post("/api/save-post", async (req, res) => {
  try {
    const existing = await Prompt.findOne({ url: req.body.url });
    if (existing) {
      return res.status(200).json({ message: "Already exists" });
    }

    const saved = await Prompt.create(req.body);
    return res.status(200).json({ message: "Saved", id: saved._id });
  } catch (err) {
    console.error("❌ Save error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


cron.schedule('0 12 * * *', () => {
  console.log("⏱️ Running scraper at 12:00 PM IST...");
  exec('py prod.py', (error, stdout, stderr) => {
    if (error) return console.error(`❌ Error: ${error.message}`);
    if (stderr) return console.error(`stderr: ${stderr}`);
    console.log(`✅ Scraper Output:\n${stdout}`);
  });
}, {
  timezone: "Asia/Kolkata",
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
