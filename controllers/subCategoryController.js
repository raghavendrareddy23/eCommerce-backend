const cloudinary = require('cloudinary').v2;
const SubCategory = require('../models/subCategory');
const Category = require('../models/category');
const Product = require('../models/products');
const fs = require('fs');

const uploadImage = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Only admins have access" });
        }
        
        // Upload image to Cloudinary
        const folder = 'images'; 
        const result = await cloudinary.uploader.upload(req.file.path, { folder: folder });
        
        // Find the Category by categoryName
        const category = await Category.findOne({ categoryName: req.body.categoryName });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        
        // Create a new record in the database for the uploaded SubCategory
        const subCategory = new SubCategory({
            subCategoryName: req.body.subCategoryName, 
            categoryName: category.categoryName,
            category: category._id, // Assign the categoryId from the found Category
            cloudinary_id: result.public_id,
            subCategoryUrl: result.secure_url
        });
        await subCategory.save();
    
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



const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.status(200).json(subCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching subcategories" });
    }
};

const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching subcategory" });
    }
};


const updateSubCategoryStatus = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }
        subCategory.subCategoryStatus = subCategory.subCategoryStatus === 'active' ? 'inactive' : 'active';
        
        await subCategory.save();

        res.status(200).json({ success: true, message: "Subcategory status updated successfully", data: subCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating subcategory status" });
    }
};


const updateSubCategory = async (req, res) => {
    try {
        const { subCategoryName, subCategoryStatus, categoryName } = req.body;

        // Find the category by name
        const category = await Category.findOne({ categoryName });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Find the subcategory by ID
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found in the database" });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Only admins have access" });
        }

        if (subCategory.cloudinary_id) {
            await cloudinary.uploader.destroy(subCategory.cloudinary_id);
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'images', public_id: subCategoryName });

        subCategory.subCategoryName = subCategoryName;
        subCategory.subCategoryStatus = subCategoryStatus;
        subCategory.categoryName = category.categoryName;
        subCategory.category = category._id,
        subCategory.subCategoryUrl = uploadResult.secure_url;
        subCategory.cloudinary_id = uploadResult.public_id;

        await subCategory.save();

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            updatedSubCategory: subCategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message }); // Send error message
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        // Find the subcategory by ID
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found in the database" });
        }

        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Only admins have access" });
        }

        // Delete associated products
        await Product.deleteMany({ subCategoryId: req.params.id });

        // Delete subcategory image from cloudinary
        await cloudinary.uploader.destroy(subCategory.subCategoryUrl, { invalidate: true });

        // Delete the subcategory
        await SubCategory.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Subcategory and associated products deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error" });
    }
};






module.exports = {
    uploadImage,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategoryStatus,
    updateSubCategory,
    deleteSubCategory,
};
