const mongoose = require('mongoose');

var motorSchema = mongoose.Schema({
    name: {
        type: String
    },
    amp: {
        type: Number
    },
    vol: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now() //always give current date
    }
})

var Motor = mongoose.model('Motor', motorSchema, "motors" );

module.exports = Motor;