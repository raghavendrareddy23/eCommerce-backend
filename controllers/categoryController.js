const Category = require('../models/category');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const fs = require('fs');
const uuid = require('uuid');

// Function to upload image to Cloudinary
const uploadImage = async (req, res, next) => {
    try {
        const folder = 'images'; 
        const result = await cloudinary.uploader.upload(req.file.path, { folder: folder });
    
        // Generate a unique identifier for categoryId
        const categoryId = uuid.v4();

        // Create a new record in the database for the uploaded file
        const category = new Category({
            categoryId: categoryId,
            categoryName: req.body.categoryName, 
            categoryStatus: 'active', 
            cloudinary_id: result.public_id,
            categoryUrl: result.secure_url
        });
        await category.save();
    
        res.status(200).json({
          success: true,
          folder: folder,
          message: "Uploaded!",
          data: result
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: "Error"
        });
      }
};


// const updateCategoryStatus = async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ success: false, message: "Category not found" });
//         }

//         // Toggle category status
//         category.categoryStatus = category.categoryStatus === 'active' ? 'inactive' : 'active';
//         await category.save();

//         res.status(200).json({ success: true, message: "Category status updated successfully", data: category });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Error updating category status" });
//     }
// };

const updateCategoryStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Toggle category status
        category.categoryStatus = category.categoryStatus === 'active' ? 'inactive' : 'active';
        
        // Save the updated category
        await category.save();

        res.status(200).json({ success: true, message: "Category status updated successfully", data: category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating category status" });
    }
};




const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching categories" });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching category" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { categoryName, categoryStatus } = req.body;

        // Find the category by its ID
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found in the database"
            });
        }

        // Delete the old image from Cloudinary if it exists
        if (category.cloudinary_id) {
            await cloudinary.uploader.destroy(category.cloudinary_id);
        }

        // Upload the new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'images', public_id: categoryName });

        // Update category details with the new image URL and Cloudinary ID
        category.categoryName = categoryName;
        category.categoryStatus = categoryStatus;
        category.categoryUrl = uploadResult.secure_url;
        category.cloudinary_id = uploadResult.public_id;

        // Save the updated category to the database
        await category.save();

        // Delete the uploaded file from the server
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            updatedCategory: category
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};



const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found in the database"
            });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(category.categoryUrl, { invalidate: true });

        // Delete the category from the database
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};


// Controller functions for CRUD operations on categories

module.exports = {
  uploadImage,
  updateCategoryStatus,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  // Define your CRUD functions here
};
