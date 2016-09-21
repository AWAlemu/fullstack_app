var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: {type: String, required: true}
});

var UserDataSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    items: [ItemSchema]
});

var UserData = mongoose.model('UserDataSchema', UserDataSchema);

module.exports = UserData;

