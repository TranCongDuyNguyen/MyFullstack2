const Otime = require("../models/model.operateTime");

module.exports.fetchOtime = function(req, res, next) {
    Otime.findOne({ _id: req.params.id }, 'otime')
        .then(payload => {
            res.json({otime: payload.otime});
        });
}
module.exports.updateOtime = function(id, data) {
	if(data) {
		Otime.updateOne({ _id: id }, { $set: { otime: data } }, { upsert: true },
			function (err) {
				if (err) {
					console.error(err);
				}
			});
	}
}