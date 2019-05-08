const mongoose = require('mongoose');

var otimeSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    otime:{
        type: Number,
        default: 0
    }
    ,
     date: {
        type: Date,
        default: Date.now() //always give current date
    }
},  { _id: false })

var Otime = mongoose.model('Otime', otimeSchema );

module.exports = Otime;