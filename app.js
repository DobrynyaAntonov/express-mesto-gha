const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(router);

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3001');
});
