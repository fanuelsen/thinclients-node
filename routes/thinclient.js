var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
};

router.post("/", ensureAuthenticated, async (request, response) => {
    try {
        var thinclient = new ThinClientModel({
            name: request.body.name,
            mac: request.body.mac,
            settings: request.body.settings
        });
        var result = await thinclient.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/", ensureAuthenticated, async (request, response) => {
    try {
        var result = await ThinClientModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/:name", ensureAuthenticated, async (request, response) => {
    try {
        var thinclient = await ThinClientModel.findOne({ name: request.params.name }).exec();
        response.send(thinclient);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put("/:name", ensureAuthenticated, async (request, response) => {
    try {
        var thinclient = await ThinClientModel.findOne({ name: request.params.name }).exec();
        thinclient.set(request.body);
        var result = await thinclient.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete("/:name", ensureAuthenticated, async (request, response) => {
    try {
        var result = await ThinClientModel.deleteOne({ name: request.params.name }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;