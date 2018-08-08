const express = require('express');
const User = require('../models/users')
const userRouter = express.Router();

// REGISTER A NEW USER

userRouter.post('/', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      next(err)
    })
})

// GET ALL USERS  - ON SEARCH USERS PAGE, SEARCH TERM FUNCTIONAL

userRouter.get ('/', (req,res,next) => {
  const { searchTerm } = req.query;
  
  const searchGame = {games: {$in: searchTerm}};

  if (searchTerm) {
    return User.find(searchGame).sort({username: 1})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
  } else if (!searchTerm) {
  return User.find().sort({username: 1})
    .then(results => {
      console.log(results);
      return res.json(results);
    })
    .catch(err => {
      next(err);
    })
  };
})

// GET USER BY ID - FOR INDIVIDUAL PROFILES

userRouter.get('/:id', (req,res,next) => {
  const id = req.params.id;

  return User.findById(id)
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

// EDIT USER - FOR EDIT PROFILE PAGE

userRouter.put('/:id', (req,res,next) => {
  const { id } =  req.params;
  // const userId = req.user._id;
  const { username, games = [], info } = req.body;

  const updateUser = { username, games, info };

  User.findOneAndUpdate({_id: id}, updateUser, {new: true})
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next()
      }
    })
    .catch(err => {
      next(err);
    })
})

module.exports = userRouter;