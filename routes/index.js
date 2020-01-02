var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');
var GroupModel = require('../models/group');

/* GET home page. */
router.get('/', ensureAuthenticated, async function (req, res, next) {
  var clients = await ThinClientModel.find().exec();
  var groups = await GroupModel.find().exec();
  res.render('index', { title: 'ThinClients', clients: clients, groups: groups });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

router.get('/login',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
        customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    console.log('Login was called in the Sample');
    res.redirect('/');
});

router.get('/auth/openid/return',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    console.log('We received a return from AzureAD.');
    res.redirect('/');
});

router.post('/auth/openid/return',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    console.log('We received a return from AzureAD.');
    res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    req.logOut();
    res.redirect(config.destroySessionUrl);
  });
});

module.exports = router;
