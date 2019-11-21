var express = require('express');
var router = express.Router();
var GroupModel = require('../models/group');

router.post("/", async (request, response) => {
    try {
        var group = new GroupModel({
            name: request.body.name
        });
        var result = await group.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/", async (request, response) => {
    try {
        var result = await GroupModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/:name", async (request, response) => {
    try {
        var group = await GroupModel.findOne({ name: request.params.name }).exec();
        response.send(group);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete("/:name", async (request, response) => {
    try {
        var result = await GroupModel.deleteOne({ name: request.params.name }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;