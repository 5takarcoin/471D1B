const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// ✅ upsert FIRST before /:userId
router.post("/upsert", async (req, res) => {
  const { userId, skills, experience, education, phone, location } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { skills, experience, education, phone, location },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ dynamic route AFTER
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;