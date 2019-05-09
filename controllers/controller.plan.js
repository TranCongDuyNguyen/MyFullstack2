const Plan = require("../models/model.plan")

module.exports.fetchPlan = function(req, res, next) {
    Plan.findOne({ _id: 1 }, 'events')
        .then(payload => {
            let events = payload.events;
            res.json({ events });
        });
}
module.exports.updatePlan = function(data) {
	Plan.updateOne({ _id: 1 }, { $set: { events: data } }, { upsert: true },
		function (err) {
			if (err) {
				console.error(err);
			}
		});
}