const express = require('express');
const Group = require('../models/groups');
const User = require('../models/users');
const groupRouter = express.Router();

// GET **YOUR** GROUPS - ON MY GROUPS PAGE

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

// GET YOUR **CREATED** GROUPS - ON MY GROUPS PAGE

groupRouter.get ('/created', (req,res,next) => {
  const currentUser = req.user._id;
  return Group.find({userId: {$in: currentUser}})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
})

// GET GROUPS - ON SEARCH GROUPS PAGE, SEARCH TERM FUNCTIONAL

groupRouter.get ('/', (req,res,next) => {
  const { searchTerm, tags } = req.query;


  if (searchTerm && tags) {
    return Group.find({groupName: {"$regex": searchTerm}}).where({tags: {$in: tags}})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
  } else if (searchTerm) {
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

// MAKE GROUP - ON MY GROUPS PAGE, MAKE YOUR OWN GROUP

groupRouter.post('/', (req,res,next) => {
  const { groupName, game, userId, groupType, tags } = req.body;
  
  const newGroup = { groupName, game, userId, groupType, tags };

  Group.create(newGroup)
    .then(result => {
      console.log(result);
      res.location(`${req.originalUrl}`).status(201).json(result)
    })
    .catch(err => {
      next(err);
    })
})

// GET GROUP BY ID  - VIEW A GROUP, FOR INDIVIDUAL GROUP PROFILE PAGE

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

groupRouter.put('/:id', (req,res,next) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { groupName } = req.body;
  const updateItem = { groupName: groupName } 

  return Group.findByIdAndUpdate(id, updateItem, {new: true})
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        next(err);
    })
})

// JOIN A GROUP - ON GROUP PAGE AND LIST OF GROUPS

groupRouter.put('/:id/join', (req,res,next) => {
  const id = req.params.id;
  const userId = req.user._id;
  // console.log(req.user);
  const updateItem = { $addToSet: {users: req.user._id} };
  console.log(req.body);

    return Group.findByIdAndUpdate(id, updateItem, {new: true})
      .then(results => {
        if (results) {
          res.json(results)
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      })
    // }
})

// LEAVE A GROUP - ON GROUP PAGE AND LIST OF GROUPS

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

// DELETE A GROUP - ON MY GROUPS PAGE (MY CREATED)

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