var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShootingSchema = new Schema({
    recordid: String,
    datasetid: String,
    fields: {}
});

module.exports = mongoose.model('Tournages', ShootingSchema);