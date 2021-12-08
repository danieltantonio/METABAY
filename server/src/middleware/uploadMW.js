const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ItemPic = require('../config/db/models/itemPic');

const uploadPath = path.join(__dirname, '..', 'static', 'images', 'items');

// Must include other fields in req.body first before picture field
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const userPath = path.join(uploadPath, req.body.item);

        if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        if(!fs.existsSync(userPath)) fs.mkdirSync(userPath);

        cb(null, userPath);
    },
    filename: async (req,file,cb) => {
        try {
            const { item } = req.body;
            const filter = /(.jpg$|.jpeg$|.png$)/i;
            const fileTypeOk = file['originalname'].match(filter)[0];
            const totalItems = await ItemPic.count({ item });
    
            if(!fileTypeOk) {
                cb('Filetype not accepted.');
            } else {
                const fileName = `${item}_-_${totalItems}${fileTypeOk}`;
                req.fileName = fileName;
                cb(null, fileName);
            }
        } catch(err) {
            cb(err);
        }
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5000000
    }
});

module.exports = upload;