const router = require('express').Router();
const {
  getUsers, getUserBuId, updateProfile, updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', getUsers);

router.get('/:userId', getUserBuId);

router.patch('/me', auth, updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
