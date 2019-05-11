const Plan = require("../models/model.plan")

module.exports.fetchPlan = function(req, res, next) {
    Plan.find()
        .sort({ date: -1 })
        .then(event => res.json(event));
}

module.exports.createPlan = function(req, res, next) {
	console.log(req.body);
	const newPlan = new Plan({
		plan: req.body.plan,
		from: req.body.from,
		to: req.body.to,
		money: req.body.money,
		calendarDate: req.body.calendarDate
	})
	newPlan.save().then(event => res.json(event)) 
}

module.exports.deletePlan = function(req, res, next){
    console.log(req.params.id); 
    Plan.deleteOne({ _id: req.params.id}, 
            function(err){
                if(err){
                    res.status(404).json({success: false});
                    return console.error(err);
                } 
                else return res.json({success: true})
            });
}