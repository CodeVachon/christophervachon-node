var mongoose = require('mongoose');
var utl = require('./../bin/utilities');

var ArticleSchema = new mongoose.Schema({
    title: String,
    safeurl: String,
    safeurl_history: Array,
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
    created_at: { type: Date, default: Date.now },
    version: { type: Number, default: 0 },
});


ArticleSchema.pre('save', function(callback) {
    var article = this;
    article.updated_at = new Date();
    article.version++;
    if (article.isModified('title') || (typeof(article.safeurl) != "String")) {
        if (article.version > 1) {
            if (!typeof(article.safeurl_history) === "Array") { article.safeurl_history = []; }
            article.safeurl_history.push(new String(article.safeurl).toString());
        }
        article.safeurl = createSafeURL(article.title);
    }
    return callback();
});


function createSafeURL(_string) {
    return utl.format_url_text(_string);
}


module.exports = mongoose.model('Article', ArticleSchema);
