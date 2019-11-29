var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ThinClientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    mac: {
        type: String,
        required: true
    },
    settings: {
        type: String,
        default: "1440"
    }
});

module.exports = mongoose.model('thinclient', ThinClientSchema)