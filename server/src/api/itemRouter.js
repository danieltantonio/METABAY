(() => {
    const express = require('express');
    const router = express.Router();

    const upload = require('../middleware/uploadMW');
    const ItemPic = require('../config/db/models/itemPic');

    router.post('/', upload.single('file'), async (req,res) => {
        try {
            const { item } = req.body;
            const picName = req.fileName;

            const newItem = new ItemPic({ item, picName });
            await newItem.save();

            res.status(201).json({ msg: "It worked" });
        } catch(err) {
            res.status(500).json(err);
        }
    });

    router.get('/', async (req,res) => {
        try {
            if(req.query.address) {
                const { address } = req.query;
                const picData = await ItemPic.findOne({ item: address });
    
                res.status(200).json({ pic: picData });
            } else {
                res.status(400).json({ msg: 'Missing address query.' });
            }
        } catch(err) {
            res.status(500).json({ msg: err });
        }
    });

    module.exports = router;
})();