const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  skills: [String],        // ["React", "Node.js", "MongoDB"]
  experience: String,      // "2 years of full stack development"
  education: String,       // "BSc Computer Science"
  phone: String,
  location: String,
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);

