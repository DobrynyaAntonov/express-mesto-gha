require('dotenv').config();
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors({
  origin: ['https://mesto.dobrynya.nomoredomains.work', 'http://localhost:3000'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('ok'));
