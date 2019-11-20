var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');

router.get("/", async (request, response) => {
    try {
        var result = await ThinClientModel.find().exec();
        response.setHeader('Content-disposition', 'attachment; filename=thinstation.hosts');
        response.setHeader('Content-type', 'text/plain');
        response.charset = 'UTF-8';
        response.write("#########THINSTATION HOSTS");
        result.forEach(element => {
            response.write("\n" + element.name + "\t" + element.mac + "\t" + element.settings);
        });
        response.end();
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;