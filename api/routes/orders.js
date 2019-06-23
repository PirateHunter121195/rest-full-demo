var express = require('express');
var router = express.Router();
var Order = require('../models/order.js');
var Product = require('../models/product');
var mongoose = require('mongoose');
router.get('/', (req, res, next) => {

    Order.find()
        .select('product quantity _id')
        .exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                docs: orders.map( order => {
                    return {
                        _id: order._id,
                    product: order.productId,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8080/orders/' + order._id
                    }
                  }
                })
                
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            }) ;
        });
});
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(product => {

            if(!product) {
              return  res.status(500).json({
                  message: 'Product not found'
              });
            }

            const order = new Order( {
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                }, 
                request: {
                    type: "GET", 
                    url:"http://localhost:8080/orders/" + result._id
                }
            });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
        })   
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(order => {

            if(!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:8080/orders'
                }    
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
router.delete('/:orderId', (req, res, next) =>{
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                url: 'http://localhost:8080/orders',
                request: {
                    type: 'POST',
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})
module.exports = router;