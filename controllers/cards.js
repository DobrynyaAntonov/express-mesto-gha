const Card = require('../models/card');

const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  addLike,
  removeLike,
};
