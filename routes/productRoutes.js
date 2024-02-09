const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const productsController = require('../controllers/productsController');
const { uploadImage, getAllProducts, getProductById, updateProductStatus, updateProduct, deleteProduct } = productsController;
const { isAuthenticated, isAdmin } = require('../utils/auth');

router.post('/uploadImage', upload.array('images', 10), isAuthenticated, isAdmin, uploadImage);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.patch('/:id', isAuthenticated, isAdmin, updateProductStatus);
router.put('/:id', upload.array('images', 10), isAuthenticated, isAdmin, updateProduct)
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
