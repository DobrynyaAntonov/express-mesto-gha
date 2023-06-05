const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const getUserBuId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.message.includes('ObjectId failed for value')) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.message.includes('ObjectId failed for value')) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
    });
};

module.exports = {
  getUsers,
  getUserBuId,
  createUser,
  updateProfile,
  updateAvatar,
};
