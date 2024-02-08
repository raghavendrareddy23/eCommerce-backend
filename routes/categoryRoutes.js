const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadImage, updateCategoryStatus,updateCategory, deleteCategory, getAllCategories, getCategoryById } = categoryController;

const upload = require('../utils/multer'); 

// Define routes
router.post('/uploadImage', upload.single('image'), uploadImage);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.patch('/:id', updateCategoryStatus);
router.put('/:id',upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

// Define other category routes here

module.exports = router;
