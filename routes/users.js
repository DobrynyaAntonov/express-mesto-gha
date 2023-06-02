const router = require('express').Router();
const { getUsers, getUserBuId, createUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserBuId);

router.post('/', createUser);

module.exports = router;
