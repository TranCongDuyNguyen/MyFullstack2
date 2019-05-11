const mongoose = require('mongoose');
var planSchema = mongoose.Schema({
    plan: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    calendarDate: {
        type: String
    },
    money: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now() //always give current date
    }
})

var Plan = mongoose.model('Plan', planSchema );

module.exports = Plan;