const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
  subCategoryUrl: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  subCategoryStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
},
{
    timestamps: true,
}

);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
