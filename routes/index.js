/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFound } = require('../middlewares/error');
const { apiLogger } = require('../middlewares/logger');

router.use(apiLogger);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.get('/loginout', (req, res) => {
  res.clearCookie('jwt', { sameSite: 'None', secure: true }).send({ message: 'Кука удалена' });
});

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});
module.exports = router;
