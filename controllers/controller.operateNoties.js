const OperateNoties = require("../models/model.operateNoties");

module.exports.fetchOperateNoties = function(req, res, next) {
    let currentPage = parseInt(req.query.page);
    let pageLimit = parseInt(req.query.limit);
    const offset = (currentPage - 1) * pageLimit;
    OperateNoties.findOne({ _id: req.params.id }, 'noties')
        .then(noties => {
            let noties1 = noties.noties;
            const currentNoties = noties1.slice(offset, offset + pageLimit);
            res.json({ noties: currentNoties, length: noties1.length });
        });
}
module.exports.updateOperateNoties = function(id, data) {
	OperateNoties.updateOne({ _id: id }, { $set: { noties: data } }, { upsert: true },
		function (err) {
			if (err) {
				console.error(err);
			}
		});
}