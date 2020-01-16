const express = require('express');

const postDb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  postDb.get()
    .then(posts => {
      res.status(200).json(posts);
    })  
    .catch(err => {
      res.status(500).json({error: 'failed to get posts'});
    })
});

router.get('/:id', validatePostId, (req, res) => {
  postDb.getById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get post'});
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  postDb.remove(req.params.id)
    .then(numRecsDeleted => {
      res.status(200).json(numRecsDeleted);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to remove post'});
    })
});

router.put('/:id', validatePostId, (req, res) => {
  postDb.update(req.params.id, req.body)
    .then(numRecsUpdated => {
      res.status(200).json(numRecsUpdated);
    })
    .catch(err => {
      res.status(500).json({error: 'failed to update post'});
    })
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  postDb.getById(id)
    .then(post => {
      if (post){
        req.post = id;
        next()
      }else{
        res.status(400).json({error: 'invalid post id'});
      }
    })
    .catch(err => {
      res.status(500).json({error: 'failed to get post'});
    })
}

module.exports = router;
