const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const transactionRouter = require('./routes/transaction');
const validationRouter = require('./routes/validator');

function rawBodySaver(req, __res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json({ verify: rawBodySaver }));
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/transaction', transactionRouter);
app.use('/validate', validationRouter);

module.exports = app;
