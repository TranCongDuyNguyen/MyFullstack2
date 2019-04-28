const MaxScale1 = require('../models/model.maxscale1');

module.exports.fetchMaxscale1 = function(req, res, next){
    MaxScale1.findOne({_id: req.params.id})
        .then(maxscale1 => res.json(maxscale1));
}

module.exports.updateMaxscale1 = function (req, res, next) {
    MaxScale1.updateOne({ _id: req.params.id}, {$set: {maxscale1:req.body.maxscale1}}, {upsert:true},
        function(err){
            if(err){
                res.status(404).json({success: false});
                return console.error(err);
            } 
            else return res.json({success: true})
        });
}