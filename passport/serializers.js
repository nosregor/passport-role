const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

// this part has access of the cookie and finds the
// connected user
// this part defines a req.user if the user is connected
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then((userDocument) => {
      // console.log('passport.deserializeUser');
      // console.log(userDocument);
      cb(null, userDocument);
    })
    .catch((err) => {
      cb(err);
    });
});
