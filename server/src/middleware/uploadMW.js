const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'static', 'images', 'items');

// Must include other fields in req.body first before picture field
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const userPath = path.join(uploadPath, req.body.itemAddr);

        if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        if(!fs.existsSync(userPath)) fs.mkdirSync(userPath);

        cb(null, userPath);
    },
    filename: (req,file,cb) => {
        const itemAddr = req.body.itemAddr;
        const itemIndex = req.body.itemIndex;
        const filter = /(.jpg$|.jpeg$|.png$)/i;
        const fileTypeOk = file['originalname'].match(filter)[0];

        if(!fileTypeOk) {
            cb('Filetype not accepted.');
        } else {
            cb(null, `${itemAddr}_-_${itemIndex}${fileTypeOk}`);
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