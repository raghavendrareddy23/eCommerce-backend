const { Router } = require('express');
const orderController = require('../controllers/orderController');
const {isAuthenticated} = require('../utils/auth');
const router = Router();

router.get('/:id', isAuthenticated, orderController.get_orders);
router.get('/:userId/:productId', isAuthenticated, orderController.get_order_by_id);
router.post('/:id', isAuthenticated, orderController.checkout);

module.exports = router;