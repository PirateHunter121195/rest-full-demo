const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bccrypt = require('bcrypt');


router.post('/signup',(req, res, next) => {
    const email = req.body.email;
    User.find({email: email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                res.status(409).json({
                    message: 'Email exists'
                });
            }else {
                bccrypt.hash(req.body.password, 10, (err, hash) => {
                    console.log(email);
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });   
            }    
        })
        .catch(err => {
        
            res.status(500).json({
                error: err
            });
        });

});


router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bccrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    res.status(401).json({
                        message: 'Auth failed'
                    });
            
                }   
                if(result) {
                    res.status(200).json({
                        message: 'Auth successfully'
                    })
                } 
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
})

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})


module.exports = router;