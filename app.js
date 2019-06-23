const express = require('express');
const app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rest-full-demo', {useNewUrlParser: true});
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
app.use(morgan('dev'));
app.use('/upload', express.static('upload'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;