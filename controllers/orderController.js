const Cart = require('../models/cartItem');
const User = require('../models/user');
const Order = require('../models/order');
const Coupon = require('../models/coupon'); 
const Products = require("../models/products");


module.exports.checkout = async (req, res) => {
  try {
    const userId = req.params.id;
    const couponId = req.body.couponId;

    console.log("User ID:", userId);
    console.log("Coupon ID:", couponId);

    const cart = await Cart.findOne({ userId });
    const user = await User.findById(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).send("You do not have items in your cart");
    }

    let totalBill = 0;
    for (const item of cart.items) {
      const product = await Products.findById(item.productId);
      if (!product) {
        console.log("Product not found:", item.productId);
        return res.status(400).send(`Product with ID ${item.productId} not found`);
      }
      item.price = product.sellPrice || product.price; 
      totalBill += item.quantity * item.price;
    }

    console.log("Total Bill before discount:", totalBill);

    let discount = 0;
    if (couponId) {
      const validCoupon = await Coupon.findById(couponId);
      console.log("Valid Coupon:", validCoupon);
      if (validCoupon) {
        console.log("Coupon Percentage:", validCoupon.percentage);
        discount = totalBill * (validCoupon.percentage / 100);
      } else {
        console.log("Invalid coupon or coupon not active");
        return res.status(400).send("Invalid coupon");
      }
    }

    console.log("Discount:", discount);

    totalBill -= discount;

    console.log("Total Bill after discount:", totalBill);

    const order = new Order({
      userId,
      items: cart.items,
      totalBill,
      coupon: couponId || null, 
    });

    console.log("Order:", order);

    await order.save();

    await Cart.findOneAndDelete({ userId });

    console.log("Order saved successfully");

    return res.status(201).json({message:"Order Saved Successfully", order});
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};





module.exports.get_orders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.get_order_by_id = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const orders = await Order.find({ userId: userId, 'items.productId': productId }).populate('items.productId');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the specified product and user' });
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};


