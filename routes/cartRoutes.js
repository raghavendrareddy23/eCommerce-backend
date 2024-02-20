const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../utils/auth');
const {
    addCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItemById,
    deleteAllCartItems,
} = require('../controllers/cartItemController');

router.get('/:id', isAuthenticated, getCartItems);
router.post('/:id', isAuthenticated, addCartItem);
router.put('/:id', isAuthenticated, updateCartItem);
router.delete('/:userId', isAuthenticated, deleteAllCartItems);
router.delete('/:userId/:itemId',isAuthenticated, deleteCartItemById);

module.exports = router;
