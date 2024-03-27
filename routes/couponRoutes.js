const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponById, updateCoupon, updateCouponStatus, deleteCouponById, validateCouponByCode } = require('../controllers/couponController');

router.post('/create-coupon', createCoupon);
router.post('/validate', validateCouponByCode);
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.put('/update-status/:id', updateCouponStatus);
router.delete('/:id', deleteCouponById);

module.exports = router;
