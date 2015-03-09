var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    timestamp: {
        type: Date
    },
    hashtag: {
        type: Array
    }
});

module.exports = mongoose.model('localTweet', TweetSchema);