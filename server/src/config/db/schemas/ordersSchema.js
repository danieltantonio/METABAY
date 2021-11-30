const { Schema } = require('mongoose');

const orderSchema = new Schema({
    itemAddress: {
        type: String,
        required: true
    },
    customerWalletAddress: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'Ordered',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    }
});

orderSchema.pre('save', next => {
    console.log("New order saved 💰");
    next();
});

module.exports = orderSchema;