const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const logger = require('morgan');
const { NotFound, BadRequest } = require('http-errors');

const production = process.env.NODE_ENV === 'production';

const app = express();

app.use(logger(production ? 'combined' : 'dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.post('/encode', (req, res, next) => {
  const data = req.body.data;
  let rounds = req.body.rounds;

  if (!data) {
    return next(new BadRequest('data is required'));
  }

  if (!rounds) {
    return next(new BadRequest('rounds is requrired'));
  }

  rounds = Number.parseInt(rounds, 10);

  if (Number.isNaN(rounds)) {
    return next(new BadRequest('rounds must be a number'));
  }

  const start = Date.now();
  bcrypt
    .hash(data, rounds)
    .then(hash => {
      res.json({
        hash,
        time: Date.now() - start
      });
    })
    .catch(error => {
      return next(new BadRequest(error.message));
    });
});

app.post('/decode', (req, res, next) => {
  const { data, hash } = req.body;

  if (!data) {
    return next(new BadRequest('data is required'));
  }

  if (!hash) {
    return next(new BadRequest('hash is requrired'));
  }

  const start = Date.now();
  bcrypt
    .compare(data, hash)
    .then(result => {
      res.json({
        result,
        time: Date.now() - start
      });
    })
    .catch(error => {
      return next(new BadRequest(error.message));
    });
});

app.use(function(req, res, next) {
  return next(new NotFound());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = status < 500 ? error.message : 'Internal server error';

  if(status >= 500) {
      console.error(error);
  }

  res.status(status).json({ error: message });
});

const port = process.env.PORT || 3000;

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.log('Server started on port ' + port);
});
