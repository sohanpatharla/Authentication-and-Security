//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const app = express();
const md5=require("md5");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sohanpatharla:sohanpatharla@cluster0.vm3etby.mongodb.net/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

const User=new mongoose.model("User",userSchema);

app.get("/home",function (req,res) {
   res.render("home"); 
});

app.get("/login",function (req,res) {
    res.render("login"); 
 });

 app.get("/register",function (req,res) {
    res.render("Register"); 
 });

 app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newUser.save().then(()=>{
        res.render("secrets");
    })
 });

 app.post("/login",function (req,res) {
    const username=req.body.username
    const password=req.body.password
    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser)
        {
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
        }
    })  
 });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});