const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {type: String, required: true, minlength: 5, maxlength: 100},
  content: {type: String, required: true, minlength: 20},
  author: {type: String, default: "Guest"},
}, 
{timestamps: true}
); // Auto createdAt/updatedAt 

module.exports = mongoose.model("Article", articleSchema);