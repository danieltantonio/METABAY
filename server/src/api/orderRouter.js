(() => {
    const express = require('express');
    const router = express.Router();

    const Order = require('../config/db/models/order');

    router.get('/', (req,res) => {
        res.status(200).json({ msg: "Order router works" });
    });

    router.post('/', async (req,res) => {
        try {
            const newOrder = new Order(req.body);
            await newOrder.save();

            res.status(201).json(newOrder);
        } catch(err) {
            res.status(500).json(err.message);
        }
    });

    module.exports = router;
})();