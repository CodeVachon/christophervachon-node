var mongoose = require('mongoose');

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
            article.safeurl_history.push(new String(article.safeurl));
        }
        article.safeurl = createSafeURL(article.title);
    }
    return callback();
});


function createSafeURL(_string) {
    return _string.replace(/[\W]{1,}/g,"-")
        .toLowerCase()
    ;
}


module.exports = mongoose.model('Article', ArticleSchema);
