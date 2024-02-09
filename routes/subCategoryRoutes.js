const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const subCategoryController = require('../controllers/subCategoryController');
const { uploadImage, getAllSubCategories, getSubCategoryById, updateSubCategoryStatus, updateSubCategory, deleteSubCategory } = subCategoryController;
const { isAuthenticated, isAdmin } = require('../utils/auth');

router.post('/uploadImage', upload.single('image'), isAuthenticated, isAdmin, uploadImage);
router.get('/', getAllSubCategories);
router.get('/:id', getSubCategoryById);
router.patch('/:id', isAuthenticated, isAdmin, updateSubCategoryStatus);
router.put('/:id', upload.single('image'), isAuthenticated, isAdmin, updateSubCategory);
router.delete('/:id', isAuthenticated, isAdmin, deleteSubCategory);

module.exports = router;
