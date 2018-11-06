const passport = require('passport');

require('./serializers');
require('./localStrategy');

// to add an extra strategy
// require('./slackStrategy');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};
