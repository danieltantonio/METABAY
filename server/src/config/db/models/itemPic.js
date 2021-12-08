const { model } = require('mongoose');
const itemPicSchema = require('../schemas/itemPicSchema');

const ItemPic = model('item-pic', itemPicSchema);

module.exports = ItemPic;