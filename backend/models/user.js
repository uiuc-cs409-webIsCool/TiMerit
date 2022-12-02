var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    dateCreated:{type:Date, default:Date.now}
});

module.exports = mongoose.model('User', UserSchema);
