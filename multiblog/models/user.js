/**
 * Created by Administrator on 2016/11/25.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema;
var userSchema = mongoose.Schema({
    realName:{type: String, required: false},
    username: {type: String, required: true,unique: true},
    hashed_password: {type: String, required: true},
    useremail: {type: String, required: true, unique: true},
    age: {type: String, required: false},
    gender: {type: String, required: false},
    address: {type: String, required: false},
    phone: {type: String, required: false},
    brief: {type: String, required: false},
    job: {type: String, required: false},
    picture: {type: String, required: false,default:'/avatar/default-pic.jpg'},
    follows: {type: Array, required: false,default:[]},
    fans: {type: Array, required: false,default:[]},
    keeps: {type: Array, required: false,default:[]},
    getTips: {type: Array, required: false,default:[]},
    createTime: {type:Date, default: Date.now()}
});

var User = mongoose.model('User', userSchema);
module.exports = User;