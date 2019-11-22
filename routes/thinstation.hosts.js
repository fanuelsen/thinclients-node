var express = require('express');
var router = express.Router();
var ThinClientModel = require('../models/thinclient');

router.get("/", async (request, response) => {
    try {
        var result = await ThinClientModel.find().exec();
        var output = "# THINSTATION HOSTS";
        result.forEach(element => {
            output += "\n" + element.name + "\t" + element.mac + "\t" + element.settings;
        });
        var buf = Buffer.from(output);
        response.setHeader('Content-type', 'application/octet-stream');
        response.setHeader('Accept-Ranges', 'bytes');
        response.setHeader('Content-Length', buf.length);
        response.setHeader('Cache-Control', 'public, max-age=0');
        response.write(buf);
        response.end();
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;