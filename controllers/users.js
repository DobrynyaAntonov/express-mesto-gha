const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { NotFound, PasswordError } = require('../middlewares/error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserBuId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound();
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashPassword) => {
      User.create({
        ...req.body, password: hashPassword,
      })
        .then((user) => res.status(201).send(user))
        .catch(next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден'));
        // throw new NotFound('Пользователь не найден');
      }
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.cookie('jwt', jwt, { maxAge: 360000, httpOnly: true, sameSite: true });
            res.send({ message: 'Авторизация прошла успешно' });
          } else {
            // res.status(403).send({ message: 'Вы ввели неправильный пароль ' });
            next(new PasswordError('Вы ввели неправильный пароль'));
            // throw new PasswordError('Вы ввели неправильный пароль');
          }
        });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send(updatedUser);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send(updatedUser);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserBuId,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
