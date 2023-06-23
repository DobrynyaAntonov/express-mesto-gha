const Card = require('../models/card');
const { NotFound, PasswordError } = require('../middlewares/error');

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      if (card.owner.toString() !== userId) {
        throw new PasswordError('У вас нет прав для удаления этой карточки');
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFound('Карточка не найдена');
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch(next);
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      return res.send(updatedCard);
    })
    .catch(next);
};

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      return res.send(updatedCard);
    })
    .catch(next);
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  addLike,
  removeLike,
};
