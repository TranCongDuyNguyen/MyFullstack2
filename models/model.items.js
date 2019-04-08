const mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true //mark this key is require
    },
    date: {
        type: Date,
        default: Date.now() //always give current date
    }
})

var Item = mongoose.model('Item', itemSchema );

module.exports = Item;