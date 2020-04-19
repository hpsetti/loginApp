var express = require("express");
var router = express.Router();


var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/users");

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var user = req.body.user;
    console.log(user.password);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
    console.log(hash);
    
     User.create(user,function(err,createduser){
        if(err){
            console.log(err);
        }else{
            console.log(createduser);
            res.redirect("/");
        }
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
    
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserbyUsername(username,function(err,user){
          if(err){
              console.log(err);
          }else{
              User.comparePassword(password,user.password,function(err,isMatch){
                  if(err){
                      console.log(err);
                  }else{
                      console.log(isMatch);
                      return done(null,user);
                  }
              });
          }
      });
    }));

router.post('/login', 
  passport.authenticate('local', { successRedirect:'/',failureRedirect: '/users/login'}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;