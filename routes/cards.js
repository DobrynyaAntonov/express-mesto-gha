const router = require('express').Router();
const {
  getCard, deleteCard, createCard, addLike, removeLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', getCard);

router.post('/', createCard);

router.delete('/:cardId', auth, deleteCard);

router.delete('/:cardId/likes', removeLike);

router.put('/:cardId/likes', addLike);

module.exports = router;
