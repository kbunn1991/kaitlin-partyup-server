'use strict';

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Group', groupSchema);