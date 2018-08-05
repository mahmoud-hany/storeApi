const express = require('express');
const router = express.Router();

const _ = require('lodash');  

const multer = require('multer'); //Handle uploading Images 
const storage = multer.diskStorage({ // storage config
    destination: function (req, file, cb) {
        cb(null, './server/uploads/'); // folder in which files will be stored.
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true); //allow [upload]
    } else {
        cb(null, false); //not allowed [Don't upload]
    }
};
const upload = multer({
    storage,
    limits: { // 3 mega bytes is maximum
        fileSize: 1024*1024*3
    },
    fileFilter
});

const { Product } = require('../models/product');

// create products
router.post('/', upload.single('imgUrl'), (req, res) => {

    console.log(req.file); // chek this to see what Data i need to edit or pick

    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        imgUrl: `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}` // to remove \\ from 
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
                    imgUrl: one.imgUrl,
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

    Product.findById(ID)
        .select('_id name price imgUrl')
        .then(product => {
            if (!product) {
                return res.status(404).json();
            }

            res.json({
                product,
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

    const body = _.pick(req.body, ['name', 'price', 'imgUrl']);

    Product.findByIdAndUpdate(ID, {$set: body}, {new: true})
        .select('_id name price imgUrl')
        .then(updatedProduct => {
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
    
    Product.findByIdAndRemove(ID).then(product => {
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