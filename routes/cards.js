const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getCard, deleteCard, createCard, addLike, removeLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', getCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/),
  }),
}), createCard);

router.delete('/:cardId', auth, deleteCard);

router.delete('/:cardId/likes', removeLike);

router.put('/:cardId/likes', addLike);

module.exports = router;
