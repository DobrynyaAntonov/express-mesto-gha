const router = require('express').Router();
const {
  getCard, deleteCard, createCard, addLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCard);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.delete('/:cardId/likes', removeLike);

router.put('/:cardId/likes', addLike);

module.exports = router;
