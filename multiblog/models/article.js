/**
 * Created by Administrator on 2016/11/25.
 */
var mongoose = require('mongoose');
var articleSchema = mongoose.Schema;
var articleSchema = mongoose.Schema({
    articleAuthor:{type: String, required: true},
    articleTitle:{type: String, required: true},
    articleType: {type: String, required: true},
    articleContent: {type: String, required: true},
    whoSee: {type: String, required: true},
    browse: {type: Number, required: false,default:0},
    keep: {type: Array, required: false},
    like: {type: Array, required: false},
    createTime: {type:Date, default: Date.now()}
});

var Article = mongoose.model('Article', articleSchema);
module.exports = Article;