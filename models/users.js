'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  games: { type: Array, required: false },
  inMyGroup: { type: Boolean, default: false },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
})

module.exports = mongoose.model('User', userSchema);