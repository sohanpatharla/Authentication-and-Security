//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require("mongoose-find-or-create");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');    
app.use(express.static("public"));

app.use(session({
    secret:"Our little secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id).then((err, user)=>{
      done(err, user);
    });
  });
  

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    secret:String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }).then(function (user) {
      return cb(user);
    });
  }
));

app.get("/home",function (req,res) {
   res.render("home"); 
});

  app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });
app.get("/login",function (req,res) {
    res.render("login"); 
 });

 app.get("/register",function (req,res) {
    res.render("Register"); 
 });

 const userWithSecret={};

 app.get("/secrets",function (req,res) {
    User.find({"secret":{$ne:null}}).then((foundUsers)=>{
        res.render("secrets",{userWithSecret:foundUsers});
    })
 });
 
 app.get("/submit",function (req,res) {
    if(req.isAuthenticated()){
        res.render("submit");
    }
    else{
        res.render("login");
    }
 });

 app.post("/submit",function (req,res) {
    const submittedSecret=req.body.secret;
    User.findById(req.user.id).then((foundUser)=>{
        if(foundUser)
        {
            foundUser.secret=submittedSecret;
            foundUser.save().then(()=>{
                res.redirect("/secrets");
            });
        }
    });
 });

 app.get("/logout",function(req,res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/home');
      });
 });


 app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(user){
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
    });
 });

 app.post("/login",function (req,res) {
    const user=new User({
    username:req.body.username,
    password:req.body.password
    });

    req.logIn(user,function (err) {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        
    })
 });

app.listen(5000, function() {
  console.log("Server started on port 3000");
});

// Final commits