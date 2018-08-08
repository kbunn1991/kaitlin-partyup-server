const express = require('express');
const Group = require('../models/groups');
const User = require('../models/users');
const groupRouter = express.Router();

// GET **YOUR** GROUPS

groupRouter.get ('/mine', (req,res,next) => {
  const userId = req.user._id;
  return Group.find({users: {$in: userId}})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
    .catch(err => {
      next(err);
    })
});

// GET GROUPS

groupRouter.get ('/', (req,res,next) => {
  const { searchTerm } = req.query;

  if (searchTerm) {
    return Group.find({groupName: {"$regex": searchTerm}}).sort({groupName: 1})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
  } else if (!searchTerm) {
  return Group.find()
    .then(results => {
      console.log(results);
      return res.json(results);
    })
    .catch(err => {
      next(err);
    })
  }
})

// MAKE GROUP

groupRouter.post('/', (req,res,next) => {
  const groupName = req.body.groupName;
  
  const newGroup = { groupName };

  Group.create(newGroup)
    .then(result => {
      res.location(`${req.originalUrl}`).status(201).json(result)
    })
    .catch(err => {
      next(err);
    })
})

// GET GROUP BY ID

groupRouter.get('/:id', (req,res,next) => {
  const id = req.params.id;

  return Group.findById(id)
  .then(result => {
    if(result) {
      res.json(result).status(200);
    } else {
      next();
    }
  })
  .catch(err => {
    next(err);
  })
})

// JOIN A GROUP

groupRouter.put('/:id/join', (req,res,next) => {
  const id = req.params.id;
  const userId = req.user._id;
  console.log(req.user);
  const updateItem = { $addToSet: {users: req.user._id} };

    return Group.findByIdAndUpdate(id, updateItem, {new: true})
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        next(err);
      })
    // }
})

// LEAVE A GROUP

groupRouter.put('/:id/leave', (req,res,next) => {
  const id = req.params.id;
  const leaveGroup = { $pull: {users: req.user._id}};

  return Group.findByIdAndUpdate(id, leaveGroup, {new: true})
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        next(err);
      })
})

groupRouter.delete('/:id', (req,res,next) => {
  const { id } = req.params;
  const userId = req.user._id;

  Group.findOneAndRemove({_id: id, userId})
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    })

})

module.exports = groupRouter;