'use strict';

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, unique: true },
  id: { type: mongoose.Schema.Types.ObjectId },
  game: { type: String, required: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  tags: { type: Array, required: false },
  info: { type: String, required: false },
  userId: { type: String, required: false },
  groupType: { type: String, required: false, default: null }
})

module.exports = mongoose.model('Group', groupSchema);