var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    title: String,
    summary: String,
    body: String,
    isDraft: Boolean,
    tags: Array,
    category: String,
    author: {
        name: String,
        email: String
    },
    publish_date: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});


ArticleSchema.pre('save', function(callback) {
    var article = this;
    article.updated_at = new Date();
    return callback();
});


module.exports = mongoose.model('Article', ArticleSchema);
