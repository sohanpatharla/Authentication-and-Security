//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    
 });

 app.post("/login",function (req,res) {

 });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});