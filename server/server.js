const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/leads", (req, res) => {
  res.send("✅ Backend is working!");
});

// Lead submission endpoint
app.post("/api/leads", async (req, res) => {
  const { name, email, company, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and Email are required" });
  }

  // Your n8n webhook URL here:
  const n8nWebhookUrl = "http://localhost:5678/webhook-test/53739166-42a6-4cbb-ae56-71f6ca7985dc";

  try {
    console.log("Forwarding lead to n8n:", req.body); // Debug log

    // Forward data to n8n webhook
    await axios.post(n8nWebhookUrl, {
      name,
      email,
      company,
      message,
    });

    return res.json({ success: true, message: "🎯 Lead forwarded to n8n successfully!" });
  } catch (error) {
    console.error("❌ Error forwarding to n8n:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return res.status(500).json({ success: false, message: "Error sending lead to n8n" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
