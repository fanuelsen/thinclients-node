var express = require('express');
var router = express.Router();
var GroupModel = require('../models/group');
var fs = require('fs');

router.post("/", async (request, response) => {
    try {
        var group = new GroupModel({
            name: request.body.name,
            resolution: request.body.resolution
        });
        var result = await group.save();
        var fileContent = 'SCREEN_RESOLUTION="' + group.resolution + '"\nXRANDR_OPTIONS="dualscreen"';
        fs.writeFile('/usr/src/app/thinstation/thinstation.conf.group-' + group.name, fileContent, function (error) {
            if (error) { console.log(error) }
        });
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