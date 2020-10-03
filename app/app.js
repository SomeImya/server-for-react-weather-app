const express = require('express');
const morgan = require('morgan');

const app = express();
const homeRouter = require('./routing/home')


app.use(morgan('dev'));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/', homeRouter);


app.use((req, res, next) => {
    const error = new Error('Some Error');
    error.status = 404;
    next(error);
});
//Handle all error in app
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message 
        }
    });
});

module.exports = app;
