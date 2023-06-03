const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack }));
};

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      res.send(updatedCard);
    })
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  addLike,
  removeLike,
};
