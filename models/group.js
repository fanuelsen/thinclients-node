var mongoose = require('../database');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    name: { type: String, required: true },
    resolution: { type: String, required: true }
});

module.exports = mongoose.db.model('group', GroupSchema)