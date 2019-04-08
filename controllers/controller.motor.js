const Motor = require('../models/model.motor');


module.exports.fetchMotor = function(req, res, next){
    Motor.find()
        .sort({ date: -1 })
        .then(motors => res.json(motors));
}