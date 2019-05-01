const mongoose = require("mongoose");

var monitorNotiesSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    noties: {
        type: Array,
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
    },
    date: {
        type: Date,
        default: Date.now() //always give current date
    }
}, { _id: false })

var MonitorNoties = mongoose.model('MonitorNoties', monitorNotiesSchema );

module.exports = MonitorNoties;