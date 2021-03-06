const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/');
    },
    filename: function(req, file, cb) {
        cb(null,  Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});
router.get('/', (req, res, next) =>{
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map( product => {
                    return {
                        name: product.name,
                        price: product.price,
                        productImage: product.productImage,
                        _id: product._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/products' + product._id
                        }
                    };
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.post('/', checkAuth, upload.single('productImage') ,(req, res, next) =>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price,
        productImage: req.file.path
    });
    product.save().then(result =>{
        res.status(200).json({
            message: 'Product created',
            product: result
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});
router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;

    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(product => {
            console.log(product);
            if(product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for proviced ID'
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
            console.log(err);
        });
});
router.patch('/:productId', (req, res, next) =>{

    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOpsp[ops.propName] = ops.value;
    }
    //   data  
//    [{
//         "propName" : "key", "value": "giatri"
//     }]

    Product.update({_id: id}, {$set: updateOps
    // {
        // name: req.body.newName,
        // price: req.body.newPrice
    // }
    })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.delete('/:productId', (req, res, next) =>{

    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result =>{ 
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json( {
                error: err
            });
        });
});

module.exports = router;