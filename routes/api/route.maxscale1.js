const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controller.maxscale1')

router.get('/:id', controller.fetchMaxscale1);

router.put('/:id', controller.updateMaxscale1);


module.exports = router;