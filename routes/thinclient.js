var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');

router.post("/", async (request, response) => {
    try {
        var thinclient = new ThinClientModel(request.body);
        var result = await thinclient.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/", async (request, response) => {
    try {
        var result = await ThinClientModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/:name", async (request, response) => {
    try {
        var thinclient = await ThinClientModel.findOne({ name: request.params.name }).exec();
        response.send(thinclient);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put("/:name", async (request, response) => {
    try {
        var thinclient = await ThinClientModel.findOne({ name: request.params.name }).exec();
        thinclient.set(request.body);
        var result = await thinclient.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete("/:name", async (request, response) => {
    try {
        var result = await ThinClientModel.deleteOne({ name: request.params.name }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;