var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NbtweetSchema = new Schema({
	hour: {
		type: Number
	}
});

module.exports = mongoose.model('Nbtweet', NbtweetSchema);