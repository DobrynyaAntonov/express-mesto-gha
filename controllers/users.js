const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { NotFound, AuthError } = require('../middlewares/error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound();
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashPassword) => {
      User.create({
        ...req.body,
        password: hashPassword,
      })
        .then((user) => {
          const { password, ...userWithoutPassword } = user.toObject();
          res.status(201).send(userWithoutPassword);
        })
        .catch(next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthError('Пользователь не найден'));
      }
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, process.env.JWT_SECRET || 'secret');
            res.cookie('jwt', jwt, {
              maxAge: 3600000, httpOnly: true, sameSite: 'none', secure: true,
            });
            res.send({ message: 'Авторизация прошла успешно' });
          } else {
            next(new AuthError('Вы ввели неправильный пароль'));
          }
        });
    })
    .catch(next);
};

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
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
