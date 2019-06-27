const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
const Product = require('../models/product');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const OrderController = require( '../controllers/orders');
router.get('/',checkAuth, OrderController.get_orders);
router.post('/', checkAuth, OrderController.post_order);

router.get('/:orderId', checkAuth, OrderController.get_order_detail);
router.delete('/:orderId',checkAuth, OrderController.delete_order);
module.exports = router;