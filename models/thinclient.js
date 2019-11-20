var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ThinClientSchema = new Schema({
    name: { type: String, required: true },
    mac: { type: String, required: true },
    settings: { type: String, default: "1920-1080-SS" }
});

module.exports = mongoose.model('thinclient', ThinClientSchema)