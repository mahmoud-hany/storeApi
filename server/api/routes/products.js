const express = require('express');
const router = express.Router();

const _ = require('lodash');  

const { Product } = require('../models/product');

// create products
router.post('/', (req, res) => {

    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    newProduct.save().then(one => {
        res.send(one);
    }).catch(err => {
        res.status(400).send(err);
    });

});

//fetch products
router.get('/', (req, res) => {
    Product.find().then(products => {
        // make the response better and add some VIP info
        const response = {
            count: products.length,
            products: products.map(one => {
                return {
                    _id: one._id,
                    name: one.name,
                    price: one.price,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${one._id}`
                    }
                }
            }),
            status: "OK"
        };
        res.json(response);
    }).catch(error => {
        res.status(400).json(error);
    })
});

//get certin product by its id
router.get('/:productId', (req, res) => {
    const ID = req.params.productId;

    Product.findById(ID).then(product => {
        if (!product) {
            return res.status(404).json();
        }
        res.json({
            product: {
                _id: product._id,
                name: product.name,
                price: product.price  
            },
            status: "OK"
        });
    }).catch(err => {
        res.status(400).json({
            message: 'invalid id',
            err,
            status: "Bad Request"
        });
    });
});

//edit products
router.patch('/:productId', (req, res) => {
    const ID = req.params.productId;

    const body = _.pick(req.body, ['name', 'price']);

    Product.findByIdAndUpdate(ID, {$set: body}, {new: true}).select('_id name price').then(updatedProduct => {
        if(!updatedProduct){
            return res.status(404).json();
        }
        res.json({
            message: 'Product Updated successfuly',
            updatedProduct,
            status: "OK"
        });
    }).catch(err => {
        res.status(400).json(err);
    });
});

router.delete('/:productId', (req, res) => {
    const ID = req.params.productId;
    
    Product.findByIdAndRemove(ID).select('_id name price').then(product => {
        if (!product) {
            return res.status(404).json();
        }
        res.json({
            message: 'Product Removed successfuly',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'}
            },
            status: "OK"
        });
    }).catch(err => {
        res.status(400).json(err);
    });
});

module.exports = router;
//   / is refer to products