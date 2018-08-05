const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const { Product } = require('../models/product');

router.post('/', checkAuth, (req, res) => {
    
    Product.findById(req.body.productId)
        .then(product => {
            if (!product ) {
                return res.status(404).json({message: 'product not found'});
            }
            
            const newOrder =  new Order({
                product: product._id,
                quantity: req.body.quantity
            });
        
            newOrder.save().then( order => {
                res.json({
                    message: 'Order was successfully created',
                    order,
                    status: "OK"
                });
            });

        }).catch(err => {
            res.status(400).json({
                message: 'productId is required and it should be a valid ObjectID. ',
                err
        });
    });
});

router.get('/', checkAuth, (req, res) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name') // we select what we need from the attached product by its id
        .then(orders => {
            res.json({
                count: orders.length,
                orders: orders.map(one => {
                    return {
                        _id: one._id,
                        product: one.product,
                        quantity: one.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${one._id}`
                        },
                        status: "OK"
                    }
                })
            })
        }).catch(error => {
            res.status(400).json(error);
    });
});

router.get('/:id', checkAuth, (req, res) => {
    const ID = req.params.id;

    Order.findById(ID)
        .select('_id product quantity')
        .populate('product') // Order will include all products properties
        .then(order => {
            if (!order ) {
                return res.status(404).json({message: 'Order not found'});
            }
            
            res.json({
                order,
                status: "OK"
            });
        }).catch(error => {
            res.status(400).json(error);
    });
});

router.delete('/:id', checkAuth, (req, res) => {
    const ID = req.params.id;

    Order.findByIdAndRemove(ID)
        .then( order=> {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.json({
                message: 'Order was deleted succefully',
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ObjectId',
                        quantity: 'Number'
                    },
                }
            });
        })
        .catch(error => {
            res.status(400).json(error);
        });
});

module.exports = router;