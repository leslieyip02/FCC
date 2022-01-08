// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function(req, res) {
  let inputDate = req.params.date;

  if(inputDate.match(/\d{5,}/)){
    inputDate = parseInt(inputDate);
  }

  let dateObject = new Date(inputDate)
  if (dateObject.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" })
  } else {
    res.json({
      unix: dateObject.valueOf(),
      utc: dateObject.toUTCString()
    });
  }
})

app.get("/api", function(req, res) {
  let dateObject = new Date();
  res.json({
    unix: dateObject.valueOf(),
    utc: dateObject.toUTCString()
  });
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});