const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../utils/auth');
const {addAddress, getAddresses, updateAddress, deleteAddress} = require('../controllers/addressController');

router.post('/:id', isAuthenticated, addAddress);
router.get('/:id', isAuthenticated, getAddresses);
router.put('/:userId/:id', isAuthenticated, updateAddress);
router.delete('/:userId/:id', isAuthenticated, deleteAddress);

module.exports = router;
