const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/user');

// create new user
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