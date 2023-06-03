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
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
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
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера', err: err.message, stack: err.stack });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send(updatedUser);
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
  getUsers,
  getUserBuId,
  createUser,
  updateProfile,
  updateAvatar,
};