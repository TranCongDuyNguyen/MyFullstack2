const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controller.plan');


router.get('/', controller.fetchPlan);

router.post('/', controller.createPlan);

router.delete('/:id', controller.deletePlan);

module.exports = router;