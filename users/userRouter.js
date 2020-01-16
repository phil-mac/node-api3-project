const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  userDb.insert(req.body)
    .then(newUser => {
      res.status(200).json(newUser);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to add user'});
    })
});

router.post('/:id/posts', validateUserId, validatePost(), (req, res) => {
  postDb.insert({...req.body, user_id: req.params.id})
    .then(newPost => {
      res.status(200).json(newPost);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to add post'});
    })
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get users'});
    })
});

router.get('/:id', validateUserId, (req, res) => {
  userDb.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get user'});
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get users posts'});
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.params.id)
    .then(numRecsDeleted => {
      res.status(200).json(numRecsDeleted);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to remove user'});
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  userDb.update(req.params.id, req.body)
    .then(numRecsUpdated => {
      res.status(200).json(numRecsUpdated);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to update user'});
    })
});

//custom middleware 

function validateUserId(req, res, next) {
  const id = req.params.id;
  userDb.getById(id)
    .then(user => {
      if (user){
        req.user = id;
        next()
      }else{
        res.status(400).json({error: 'invalid user id'});
      }
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get user'});
    })
}

function validateUser() {
  return validateBodyProp('user', 'name');
  // if(req.body){
  //   if(req.body.name){
  //     console.log('validated user body and name field')
  //     next()
  //   }else{
  //     res.status(400).json({message: "missing required name field"})
  //   }
  // }else{
  //   res.status(400).json({message: "missing user data"})
  // }
}

function validatePost() {
  return validateBodyProp('post', 'text');
}

function validateBodyProp(resourceName, prop){
  return function(req, res, next){
    if(req.body){
      if(req.body[prop]){
        console.log(`validated ${resourceName} body and ${prop} field`)
        next()
      }else{
        res.status(400).json({message: `missing required ${prop} field`})
      }
    }else{
      res.status(400).json({message: `missing ${resourceName} data`})
    }
  }
}

module.exports = router;
