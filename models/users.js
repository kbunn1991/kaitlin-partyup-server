'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: mongoose.Schema.Types.ObjectId },
  games: { type: Array, required: false },
  inMyGroup: { type: Boolean, default: false },
  // groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
})

userSchema.set('toObject', {
  virtuals: true, // include built-in virtual `id`
  versionKey: false, // remove _v
  transform: (doc,ret) => {
    // delete ret._id; // delete `_id`
    delete ret.password;
  }
})

userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);