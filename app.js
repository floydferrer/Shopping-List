const express = require('express');
const routes = require('./routes')
const app = express();

app.use(express.json());

app.use('/items', routes);

app.use((err, req, res, next) => {
    let status = err.status || 500;
    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

module.exports = app;