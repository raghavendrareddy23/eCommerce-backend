const mongoose = require("mongoose");

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness
    default: () => {
      // Generate a unique identifier using a library like `uuid`
      const uuid = require("uuid").v4;
      return uuid();
    },
  },
  categoryName: {
    type: String,
    required: true,
  },
  categoryUrl: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String, // Store the public ID from Cloudinary
  },
  categoryStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active", // Default status is active
  },
});

// Create the Category model using the schema
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
