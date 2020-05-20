var express= require('express')
var http= require('http')
var body=require('body-parser')
var mongoose = require('mongoose')
const storage = require('node-sessionstorage')

var app = express()

app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(body.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/fooddb", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

var registrationschema= new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String
})

var foodmodel= mongoose.model("foodmodel", registrationschema)


app.get("/home/:id", function(req,res){
    var id=req.params.id;
    foodmodel.findById(id, function(err, person){
        if(err){
            console.log(err);
        }
        else{
            res.render("home2", { person:person })
        }
    })
})

app.get("/login", function(req,res){
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.get("/ccphotos", function(req, res){
    res.render("ccphotos")
})

app.get("/places", (req,res)=>{
    var a= storage.getItem('person')
    foodmodel.findById( a, (err, person)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            res.render("places", {person : person})
        }
    })
})


app.get("/wadalamap", function(req, res){
    
    var a = storage.getItem("person")
    foodmodel.findById(a, (err, person) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render("wadalamap", { person: person })
        }
    })})


app.get("/cafecreme", function (req, res) {
    var a = storage.getItem("person")
    foodmodel.findById(a, (err, person) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render("cafecreme", { person: person })
        }
    })
})

app.post("/register", function(req, res){
    var n=req.body.name;
    var un=req.body.username;
    var email= req.body.email;
    var pass= req.body.pass;
    var newregistration = {name:n, username:un, email: email, password: pass}
    foodmodel.create(newregistration, function(err, user){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render("login")
        }
    })
})



app.post("/login", function(req, res){
    var un= req.body.username;
    var p= req.body.pass;
    foodmodel.findOne({username: un}, function(err, search){
        var a = search._id;
        if(p==search.password)
        {
            res.redirect("/home/"+a)
        }
        else if(p != search.password){
            res.redirect("/login")
        }
        else{
          console.log(err)
        }
    })
})

app.post("/search/:id", (req, res)=>{
    foodmodel.findById(req.params.id, (err, person)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            var a=person._id;
            storage.setItem('person', a)
            res.redirect("/places")
        }
    })
})

app.listen(2029, "localhost", function(){
    console.log("Connected to server")
})