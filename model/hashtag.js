var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HashtagSchema = new Schema({
	name: {
		type: String
	},
	nb: {
		type: Number
	}
});

module.exports = mongoose.model('Hashtag', HashtagSchema);