const mongoose = require('mongoose');

var maxscale1Schema = mongoose.Schema({
    _id: {
        type: Number
    },
    maxscale1 : {
        type: Array,
        val: {
            type: String,
            default: "100"
        },
        bs: {
            type: Boolean,
            default: false
        },
        ss: {
            type:Boolean,
            default: false
        }
    },
     date: {
        type: Date,
        default: Date.now() //always give current date
    }
},  { _id: false })

var MaxScale1 = mongoose.model('MaxScale1', maxscale1Schema );

module.exports = MaxScale1;