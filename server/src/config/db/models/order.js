const { model } = require('mongoose');
const orderSchema = require('../schemas/ordersSchema');

const Order = model('order', orderSchema);

module.exports = Order;