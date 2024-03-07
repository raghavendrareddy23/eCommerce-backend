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
            min: [1, 'Quantity can not be less then 1.']
        },
    }],
    date_added: {
        type: Date,
        default: Date.now
    }
})

module.exports = Order = mongoose.model('order',OrderSchema);