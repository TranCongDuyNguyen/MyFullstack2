//import document model
const Item = require('../models/model.items');

module.exports.fetchItems = function(req, res, next){
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items));
}

module.exports.createItem = function(req, res, next){
    const newItem = new Item({
        name: req.body.name   //body-parser allow this happens
    })

    newItem.save().then(item => res.json(item)) 
 
}

module.exports.deleteItem = function(req, res, next){
    Item.deleteOne({ _id: req.params.id}, 
            function(err){
                if(err){
                    res.status(404).json({success: false});
                    return console.error(err);
                } 
                else return res.json({success: true})
            });
}