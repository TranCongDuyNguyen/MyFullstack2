const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/middleware.auth');
const controller = require('../../controllers/controller.motor');

router.get('/', controller.fetchMotor);

module.exports = router;