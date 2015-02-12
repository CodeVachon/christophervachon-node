var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    title: String,
    summary: String,
    url: String,
    repo: String,
    tags: Array,
    category: String,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
