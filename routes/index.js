var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');
var GroupModel = require('../models/group');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var clients = await ThinClientModel.find().exec();
  var groups = await GroupModel.find().exec();
  res.render('index', { title: 'ThinClients', clients: clients, groups: groups });
});

module.exports = router;
