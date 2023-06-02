const User = require('../models/user');

// const users = [];
// let id = 0;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: 'Internal server Error', err: err.message, stack: err.stack }));
};

const getUserBuId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: 'Internal server Error', err: err.message, stack: err.stack }));
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: 'Internal server Error', err: err.message, stack: err.stack }));
};

module.exports = {
  getUsers,
  getUserBuId,
  createUser,
};
