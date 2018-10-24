const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const logger = require('morgan');

const production = process.env.NODE_ENV === 'production';

const app = express();

app.use(logger(production ? 'combined' : 'dev'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

app.post('/bcrypt', (req, res) => {
    bcrypt.hash(req.body.text, 13)
        .then(hash => {
            res.json({
                hash
            });
        }).catch(error => {
            res.status(500).json({
                error
            });
        });
});

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Server started on port ' + port);
});