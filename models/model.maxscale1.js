const mongoose = require('mongoose');

var maxscale1Schema = mongoose.Schema({
    _id: {
        type: Number
    },
    maxscale1 : [{
        val: {
            type: String,
            default: "100"
        },
        fault: {
            type: Number,
            default: 0
        },
        warn: {
            type: Number,
            default: 0
        },
        pos: {
            type: String,
            default: '126,86 136,80 136,92'
        },
        bs: {
            type: Boolean,
            default: false
        },
        ss: {
            type:Boolean,
            default: false
        }
    }],
     date: {
        type: Date,
        default: Date.now() //always give current date
    }
},  { _id: false })

var MaxScale1 = mongoose.model('MaxScale1', maxscale1Schema );

module.exports = MaxScale1;