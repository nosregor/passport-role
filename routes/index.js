const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/', (req, res, next) => {
//   // req.user is defined if the user is connected
//   res.render('index', {
//     isConnected: !!req.user,
//   });
//   // !! converts truthy/falsy to true/false
// });

module.exports = router;
