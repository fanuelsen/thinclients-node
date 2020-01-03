var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');
var GroupModel = require('../models/group');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

router.get('/', ensureAuthenticated, async function (req, res) {
  var clients = await ThinClientModel.find().exec();
  var groups = await GroupModel.find().exec();
  res.render('index', { title: 'ThinClients', clients: clients, groups: groups });
});

module.exports = router;
