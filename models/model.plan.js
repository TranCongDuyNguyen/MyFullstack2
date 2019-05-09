const mongoose = require('mongoose');
var planSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    events: [{
        plan: {
            type: String
        },
        from: {
            type: String
        },
        to: {
            type: String
        },
        date: {
            type: String
        }
    }],
     date: {
        type: Date,
        default: Date.now() //always give current date
    }
},  { _id: false })

var Plan = mongoose.model('Plan', planSchema );

module.exports = Plan;