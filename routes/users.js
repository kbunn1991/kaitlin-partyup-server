const express = require('express');
const User = require('../models/users')
const userRouter = express.Router();
const passport = require('passport');

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

userRouter.get ('/', passport.authenticate('jwt', { session: false, failWithError: true }), (req,res,next) => {
  const { searchTerm } = req.query;
  
  const searchGame = {games: {"$regex": searchTerm}};

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

userRouter.get('/:id',  passport.authenticate('jwt', { session: false, failWithError: true }), (req,res,next) => {
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

userRouter.put('/:id',  passport.authenticate('jwt', { session: false, failWithError: true }), (req,res,next) => {
  const { id } =  req.params;
  // const userId = req.user._id;
  const { profileImage, games = [], tags = [] } = req.body;

  // const updateUser = { profileImage, games, tags };
  // console.log(updateUser); 

  User.findById(id)
    .then(user => {
      console.log(games);
      if (profileImage) {
        user.profileImage = profileImage
      };
      if (games.length > 0 && games[0] !== '') {
        user.games.push(...games)
      };
      if (tags !== []) {
        user.tags.push(...tags)
      };
      user.save( (err, savedUser) => {
        if (err) { next (err); }
        else { res.json(savedUser) }
      }) 
    }).catch(err => {
      next(err);
    })
  })


  // LEAVE A GROUP - ON GROUP PAGE AND LIST OF GROUPS

  // delete -> users/:id/game/gameId

  userRouter.put('/:id/deleteGame', passport.authenticate('jwt', { session: false, failWithError: true }), (req,res,next) => {
    const { id } =  req.params;
    const gameId = req.body.gameId;
    const deleteGame = { $pull: {games: gameId} };
    console.log(`GameId is ${gameId}`);
    return User.findByIdAndUpdate(id, deleteGame, {new: true})
        .then(results => {
          res.json(results)
        })
        .catch(err => {
          next(err);
        })
      })

  // delete should use delete route
  
  // User.findOneAndUpdate({_id: id}, updateUser, {new: true})
  //   .then(result => {
  //     if(result) {
  //       res.json(result);
  //     } else {
  //       next()
  //     }
  //   })
  //   .catch(err => {
  //     next(err);
  // })


module.exports = userRouter;