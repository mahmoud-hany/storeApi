/*
    https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen

    https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
*/
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//db connection
const { mongoose } = require('./api/db/connect');
 
const port = process.env.PORT || 3000;

// Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//C:\Users\Mahmoud\Desktop\node-api\server\uploads\2018-08-05T08-15-22.924ZviewProduct.png


//handle un defined routes [errors]
app.use(morgan('dev'));
app.use('/server/uploads', express.static('server/uploads'));
app.use(bodyParser.json());
/*
    Now body parser is included in express by default
    app.use(express.urlencoded({extended: false})); 
    app.use(express.json());
*/

//handling CORS Errors
app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*'); //[*]means allow all we can set it [http://cool.com]
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'POST, GET, DELETE, PATCH');
        res.status(200).json({});
    }

    next();
});

//Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//handle errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;

    next(error);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});