const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {isAuthenticated, isAdmin} = require('../utils/auth');
const { uploadImage, updateCategoryStatus,updateCategory, deleteCategory, getAllCategories, getCategoryById } = categoryController;

const upload = require('../utils/multer'); 

// Define routes
router.post('/uploadImage', upload.single('image'),isAuthenticated, isAdmin, uploadImage);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.patch('/:id', isAuthenticated,isAdmin, updateCategoryStatus);
router.put('/:id',upload.single('image'),isAuthenticated, isAdmin, updateCategory);
router.delete('/:id',isAuthenticated, isAdmin, deleteCategory);

module.exports = router;
