const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', getUsers);

router.get('/me', auth, getUserById);

router.get('/:userId', auth, getUserById);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/),
  }),
}), updateAvatar);

module.exports = router;
