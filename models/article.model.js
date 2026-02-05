const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true, 
    trim: true, // Ensures no leading/trailing spaces are saved in the DB
    minlength: 5, 
    maxlength: 100
  },
  content: {
    type: String, 
    required: true, 
    minlength: 20
  },
  author: {
    type: String, 
    default: "Guest",
    trim: true // Standardizes author names by removing extra spaces
  },
  // Added tags: Standard backend feature for filtering/querying data
  tags: {
    type: [String],
    default: []
  },
  // Added status: Demonstrates 'enum' validation (restricts input to specific values)
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  // Added readCount: Demonstrates handling numeric increments in the backend
  readCount: {
    type: Number,
    default: 0
  }
}, 
{ 
  timestamps: true // Better than manual dates; handles createdAt/updatedAt automatically
});

// BONUS ADDITION 5 
// This creates a text index on title and content.
// This is mandatory for using the $text search operator in the controller.
articleSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Article", articleSchema);
