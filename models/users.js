var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
    email:String,
    username:String,
    password:String
});

// var User = mongoose.model("Users",userSchema);


var User = module.exports = mongoose.model("Users",userSchema);

module.exports.getUserbyUsername = function(username,callback){
    var query = {username:username};
    User.findOne(query,callback);
}

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.comparePassword = function(password,hash,callback){
    bcrypt.compare(password, hash, function(err, isMatch) {
        if(err){
            console.log(err);
        }else{
            callback(null,isMatch);
        }
    });
}