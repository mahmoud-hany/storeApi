const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };

    res.json({
        message: 'POST/ orders route',
        order
    });
});

router.get('/', (req, res) => {
    res.json({
        message: 'GET/ orders route'
    });
});

router.get('/:id', (req, res) => {
    const ID = req.params.id;

    res.json({
        message: 'GET/ orders/:id route',
        ID
    });
});

router.delete('/:id', (req, res) => {
    const ID = req.params.id;

    res.json({
        message: 'DELETE/ orders/:id route',
        ID
    });
});


module.exports = router;