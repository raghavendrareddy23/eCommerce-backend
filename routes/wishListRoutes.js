// wishListRoutes.js
const express = require('express');
const router = express.Router();
const wishListController = require('../controllers/wishListController');
const {isAuthenticated} = require('../utils/auth');

router.post('/:id',isAuthenticated, wishListController.addToWishList);
router.get('/:userId', isAuthenticated, wishListController.getWishList);
router.delete('/:userId/:productId', isAuthenticated, wishListController.removeFromWishList);

module.exports = router;
