const { Schema } = require('mongoose');

const itemPicSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    picName: {
        type: String,
        required: true
    }
});

itemPicSchema.pre('save', next => {
    console.log("Item Pic Saved~! 📷");
    next();
});

module.exports = itemPicSchema;