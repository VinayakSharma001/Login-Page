//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
  apiKey: "5fdc35a7",
  apiSecret: "VLEzQu9Sj0engkpe"
});

const app=express();
//app.use(bodyParser.urlencoded({extended : true}));


mongoose.connect("mongodb+srv://Vinayak70701:@Vinayak123@cluster0.zbvcq.mongodb.net/Internship",{bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});

app.use(express.static('public'));
app.set("view engine",'ejs');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const Schema={
    first_name : String,
    middle_name: String,
    last_name : String,
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String,
    Mobile_Number:{
        type: Number,
        required: true,
        },
        dob:Date,
        address1:String,
        address2:String,
        city:String,
        state:String,
        pincode:Number,
        education:String
     

};


const User=mongoose.model("User",Schema);


app.use(bodyParser.urlencoded({
    extended: true
  }));

var verifyRequestId;
var myData;
  app.post("/register",function(req,res)
  {
    //   var usr=new User({
    //       first_name:req.body.first_name,
    //       middle_name:req.body.middle_name,
    //       last_name:req.body.last_name,
    //       email:req.body.email,
    //       password:req.body.password,
    //       Mobile_Number:req.body.Mobile_Number,
    //       dob:req.body.dob,
    //       address1:req.body.address1,
    //       address2:req.body.address2,
    //       city:req.body.city,
    //       state:req.body.state,
    //       pincode:req.body.pincode,
    //       education:req.body.education
    //   });
     myData = new User(req.body);
     //myData.save();

    
    //console.log();
    //   usr.save();
      //console.log(req.body);
       //var mn="91"+(req.body.Mobile_Number).toString();
      vonage.verify.request({
             number: "91"+req.body.Mobile_Number,
            brand: "Vinayak Sharma"
        }, (err, result) => {
              if (err) {
              console.error(err);
              } else {
                verifyRequestId = result.request_id;
              console.log('request_id', verifyRequestId);
              console.log('request_id', result.request_id);
              res.render("otp",{number:req.body.Mobile_Number});
              res.render("otp",{requestId:result.request_id});
              }
      
  });
});


   app.post("/otp",function(req,res)
   {
     

        vonage.verify.check({
          request_id: req.body.requestId,
          code: req.body.code
        }, (err, result) => {
          if (err) {
            console.error(err);
            //res.send(500,'showAlert')
          } else {
            //console.log(result);
            myData.save();
            res.sendFile(__dirname+"/successfully_registered.html");
          }
        });
    });
    app.post("/successfully_registered",function(req,res){
      res.sendFile(__dirname+"/login.html");
    });




  app.post("/",function(req,res)
  {
    var e=req.body.username;
    var p=req.body.password;

    User.findOne({
      'email': e,
      'password':p
  },
  function(err, user) {

     

      //if user found.
      if (user) {
         res.sendFile(__dirname+"/success.html");
        }
       else{
          res.sendFile(__dirname+"/failure.html");
      }

      
    });
  });

  app.post("/login",function(req,res)
  {
    res.sendFile(__dirname+"/login.html");
  });
  app.get("/register",function(req,res)
  {
    res.sendFile(__dirname+"/x.html");
  });


  app.get("/failure",function(req,res)
  {
    res.sendFile(__dirname+"/failure.html");

  });
  app.get("/success",function(req,res)
  {
    res.sendFile(__dirname+"/success.html");

  });

app.get("/",function(req,res)
{
   res.sendFile(__dirname+"/login.html");
});
app.listen(process.env.PORT || 3000,function ()
{
    console.log("Server started on port 3000");
});

