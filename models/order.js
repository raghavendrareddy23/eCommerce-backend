const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User"
    },
    items: [{
        productId: {
            type: String,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less than 1.']
        },
    }],
    totalBill: {
        type: Number,
        default: 0
    },
    date_added: {
        type: Date,
        default: Date.now
    }
});

module.exports = Order = mongoose.model('Order', OrderSchema);
