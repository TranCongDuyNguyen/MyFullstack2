const MonitorNoties = require("../models/model.monitorNoties");

module.exports.fetchMonitorNoties = function(req, res, next) {
	if (req.params.id === "1") {
		let currentPage = parseInt(req.query.page);
		let pageLimit = parseInt(req.query.limit);
		const offset = (currentPage - 1) * pageLimit;
		MonitorNoties.findOne({ _id: req.params.id }, 'noties')
			.then(noties => {
				let noties1 = noties.noties;
				const currentNoties = noties1.slice(offset, offset + pageLimit);
				res.json({ noties: currentNoties, length: noties1.length });
			});
	}
	else if (req.params.id === "2") {
		let currentPage = parseInt(req.query.page);
		let pageLimit = parseInt(req.query.limit);
		const offset = (currentPage - 1) * pageLimit;
		MonitorNoties.findOne({ _id: req.params.id }, 'noties')
			.then(noties => {
				let noties2 = noties.noties;
				const currentNoties = noties2.slice(offset, offset + pageLimit);
				res.json({ noties: currentNoties, length: noties2.length });
			});
	}
}
module.exports.updateMonitorNoties = function(id, data) {
	MonitorNoties.updateOne({ _id: id }, { $set: { noties: data } }, { upsert: true },
		function (err) {
			if (err) {
				console.error(err);
			}
		});
}