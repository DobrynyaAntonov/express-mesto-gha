const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // minlength: 2,
    // maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    // validate: {
    //   validator: (value) => {
    //     const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*\/?$/;
    //     return urlPattern.test(value);
    //   },
    //   message: 'Некорректная ссылка',
    // },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
