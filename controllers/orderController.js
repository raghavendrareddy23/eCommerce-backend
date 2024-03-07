const Order = require("../models/order");
const Cart = require("../models/cartItem");
const User = require("../models/user");

module.exports.get_orders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.get_order_by_id = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Find orders for the specified user that contain the specified product ID in their items array
        const orders = await Order.find({ userId: userId, 'items.productId': productId });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the specified product and user' });
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports.checkout = async (req, res) => {
  try {
    const userId = req.params.id;
    const { source } = req.body;
    const cart = await Cart.findOne({ userId });
    const user = await User.findById(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).send("You do not have items in your cart");
    }

    // Create an order
    const order = new Order({
      userId,
      items: cart.items,
    });

    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
