const mongoose = require("mongoose");

var operateNotiesSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    noties: [{
        notiId: {
            type: String
        },
        type: {
            type: String
        },
        warnTime: {
            type: String
        },
        warnMsg: {
            type: String
        }
    }],
    date: {
        type: Date,
        default: Date.now() //always give current date
    }
}, { _id: false })

var OperateNoties = mongoose.model('operateNoties', operateNotiesSchema );

module.exports = OperateNoties;