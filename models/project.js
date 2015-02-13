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


ProjectSchema.pre('save', function(callback) {
    var project = this;
    project.updated_at = new Date();
    return callback();
});


module.exports = mongoose.model('Project', ProjectSchema);
