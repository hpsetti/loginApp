var express = require("express");
var app = express();

var session = require("express-session");
var cookieParser = require('cookie-parser')
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");


var users = require("./routes/users.js");



app.use(bodyParser.urlencoded([{extended:false}]));
app.set("view engine","ejs");
app.use(cookieParser())
app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

mongoose.connect("mongodb://localhost/login_app");


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentname = req.user;
    next();
});



app.get("/",isLoggedIn,function(req,res){
    res.render("index");
});

app.post("/hello",isLoggedIn,function(req,res){
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        console.log("not logged in");
        res.redirect("/users/login");
    }
}

app.use("/users",users);


app.listen(3000,function(){
    console.log("server has been started!!!");
});