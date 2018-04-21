const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
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

app.listen(process.env.PORT || 3000);