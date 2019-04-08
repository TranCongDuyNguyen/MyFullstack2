const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/middleware.auth');
const controller = require('../../controllers/controller.item');

router.get('/', controller.fetchItems);

router.post('/', authMiddleware, controller.createItem);

router.delete('/:id', authMiddleware, controller.deleteItem);

module.exports = router;