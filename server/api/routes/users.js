const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

// create new user [ User sing UP]
router.post('/signup', (req, res) => {
    // search for the provided email 
    User.find({email: req.body.email}).then(user => {
        if ( user.length >= 1 ) {
            return res.status(409).json({ //if the email exist
                message: 'Email is already exist'
            });
        }

        const password = req.body.password;

        bcrypt.hash(password, 10, (error, hashedPass) => {
            if ( error ) {
                return res.status(409).json(error);
            }

            //if there was no error == store data
            const user = new User({
                email: req.body.email,
                password: hashedPass
            });

            user.save().then( result => {
                res.json({
                    message: 'User Created', // remove result for security
                    result  
                })
            }).catch(error => {
                res.status(400).json({error})
            });
        });
    }).catch(error => {
        res.status(400).json(error);
    })
}); 


// User sign in
router.post('/login', (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    User.findOne({email}).then( user => {
        if ( !user ) {
            return res.status(401).json({ // 401 means un authorized
                message: 'Auth failed',
            });
        }
        
        bcrypt.compare(pass, user.password, (err, result) => { // password - hashed password
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            
            if (result) { // if it true means that password of the user is match hashed one
                const data = {
                    email,
                    _id: user._id
                };

                const token = jwt.sign(data, 'MAHMOUD', { expiresIn: "1h"});

                return res.status(200).json({
                    message: 'Auth successful',
                    token
                })
            }

            res.status(409).json({
                message: 'Auth failed',
                err
            });
        });
        
    }).catch( err => {
        res.status(400).json(err);

    });
})

//delete user
router.delete('/:userId', (req, res) => {
    const ID = req.params.userId;

    User.findByIdAndRemove(ID).then(user => {
        if ( !user ) {
            return res.status(404).json({
                message: 'User is not found'
            })
        }

        res.json({
            message: 'User is deleted successfully'
        });
    }).catch(err => {
        res.status(400).json(err)
    })
});

module.exports = router;