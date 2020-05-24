const express=require('express'); 
const bodyParser=require('body-parser'); 
http = require('http');
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/mydb'); 
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

const app=express() 


app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 
	var pass = req.body.password; 
	var phone =req.body.phone; 

	var data = { 
		"name": name, 
		"email":email, 
		"password":pass, 
		"phone":phone 
	} 
db.collection('userDetails').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
			
	}); 
		
	return res.redirect('signup_success.html'); 
}) 

app.post('/login', function(req,res){ 
	var email1 =req.body.email; 
    var pass = req.body.password; 
    
    var query = {email:email1};
    var loggedInUserName, loggedInUserEmail, loggedInUSerPhone;
db.collection('userDetails').find(query).toArray(function(err, result){ 
		if (err) throw err; 
        console.log("result"); 
        if(result.password==pass){
            loggedInUserName = result.name;
            loggedInUserEmail = result.email;
            loggedInUSerPhone = result.phone;
            res.redirect('landingPage.html');
        }
			
    }); 
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1; 
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var timeStamp = date+"-"+month+"-"+year+" "+hours+":"+minutes+":"+seconds;

    var updateQuery = {email:email1},
    update = { name:loggedInUserName,email:loggedInUserEmail,phone:loggedInUSerPhone, lastVisited:timeStamp },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    db.collection('pageVisitRecord').findOneAndUpdate(query, update, options, function(err, result) {
        if (err) throw err;
        onsole.log("Page Visit Record Updated");
    });
	
}) 

app.get("/getdetails", function (req, res) {   
    db.collection('pageVisitRecord').find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render("record", { details: allDetails })
        }
    })
    })


app.get('/',function(req,res){ 
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect('index.html'); 
}).listen(3000) 


console.log("server listening at port 3000"); 
