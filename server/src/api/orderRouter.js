(() => {
    const express = require('express');
    const upload = require('../middleware/uploadMW');
    const router = express.Router();

    const Order = require('../config/db/models/order');

    router.get('/', async (req,res) => {
        if(req.query.item && req.query.order) {
            try {
                const { item, order } = req.query;
                const getItem = await Order.findOne({ itemAddress: item, orderIndex: order });

                res.status(200).json(getItem);
            } catch(err) {
                res.status(500).json({ err });
            }
        }

        res.status(200).json({ msg: 'hello' });
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

    router.post('/test', upload.single('file'), async (req,res) => {
        res.status(200).json({ msg: 'Testing' });
    });

    module.exports = router;
})();