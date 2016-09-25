var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    name: {type: String, required: true},
    checked: {type: Boolean, required: true}
});


var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

