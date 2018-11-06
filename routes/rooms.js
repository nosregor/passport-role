const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

/* GET all /my-rooms that belong to _owner who is the user logged in  */
router.get('/my-rooms', ensureAuthenticated, (req, res, next) => {
  Room.find({ _owner: req.user._id })
    .then((rooms) => {
      res.render('rooms/index', { rooms });
    });
});

// Add new room
router.get('/new', ensureAuthenticated, (req, res, next) => {
  res.render('rooms/new');
});

router.post('/new', ensureAuthenticated, (req, res, next) => {
  const { description, imageUrl, address } = req.body;

  Room.create({
    description,
    imageUrl,
    address,
    _owner: req.user._id,
  })
    .then((room) => {
      res.redirect('/rooms');
    });
});


function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.redirect('/');
    }
  };
}

// checkRole('ADMIN') check if the user has the role 'ADMIN'
// if yes, goes to the next middleware
// if no, redirects to '/'
router.get('/rooms', checkRole('ADMIN'), (req, res, next) => {
  Room.find()
    .then((rooms) => {
      res.render('rooms', { rooms });
    });
});

module.exports = router;
