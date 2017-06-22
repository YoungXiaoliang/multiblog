/**
 * Created by Administrator on 2016/11/25.
 */
var mongoose = require('mongoose');
var commentSchema = mongoose.Schema;
var commentSchema = mongoose.Schema({
    commentAuthor:{type: String, required: true},
    commentArticle:{type: String, required: true},
    commentContent:{type: String, required: true},
    commentReply: {type: String, required: false},
    createTime: {type:Date, default: Date.now()}
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;