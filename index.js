
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require('dotenv').config();

const app = express();

console.log("server running");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname+ "/index.html");


});

app.post("/", function(req, res) {
  console.log(req.method);
  var data = {
    members: [{
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.fname,
        LNAME: req.body.lname
      }
    }]
  }


  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/dccd2886cc",
    method: "POST",
    headers: {
      "Authorization": process.env.USER_ID + process.env.API_KEY
    },
    body: JSON.stringify(data)
  }
  request(options, function(error, response, body) {
    console.log(response.statusCode);
    if (error) {
      res.sendFile(__dirname+ "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname+ "/success.html")
      } else {
        res.sendFile(__dirname+ "/failure.html");
      }
    }
  });

});

app.post("/failure", function(req, res){
  res.sendFile(__dirname+ "/index.html");
});
app.listen(process.env.PORT || 3000);
