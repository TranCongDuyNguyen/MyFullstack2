const express = require('express');
const router = express.Router();

const controller = require('../../controllers/controller.auth');
const authMiddleware = require('../../middlewares/middleware.auth');

router.post('/', controller.login);
router.get('/user', authMiddleware, controller.getUserInfo);

module.exports = router;