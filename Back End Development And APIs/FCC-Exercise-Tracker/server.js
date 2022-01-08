const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Creating a model for each user
const userSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
  count: { type: Number, "default": 0 },
  log: { type: Array , "default" : [] }
});
let User = mongoose.model("User", userSchema);

// Creating a new user
app.post("/api/users", function(req, res) {
  User.create({ username: req.body.username }, function(err, user) {
    if (err) return console.log(err);
    return res.json({
      username: user.username,
      _id: user._id
    })
  });
});

// Getting the list of all users
app.get("/api/users", function(req, res) {
  var outputArray;
  User.find({}, function(err, users) {
    if (err) return console.log(err);
    if (users) {
      outputArray = users.map((user) => {
        return {
          username: user.username,
          _id: user._id.toString()
        }
      });
      res.json(outputArray);
    } ;
  });
});

// Updating user data through the form
app.post("/api/users/:_id/exercises", function(req, res) {
  let exerciseDate = () => {
    if (req.body.date) return new Date(req.body.date).toDateString();
    return new Date().toDateString();
  }

  User.findByIdAndUpdate(req.params._id, {
    description: req.body.description,
    duration: req.body.duration,
    date: exerciseDate()
  }, { returnDocument: "after"} , function(err, user) {
    if (err) return console.log(err);
    if (user == null) return console.log("user not found");
    // Updating the log
    if (user.description && user.duration && user.date) {
      console.log("log updated")
      user.log.push({
        description: user.description,
        duration: user.duration,
        date: user.date
      });
      user.count = user.log.length;
      user.save();
    }
    // Returning the exercise entry
    console.log("user updated");
    return res.json({
      username: user.username,
      description: user.description,
      duration: user.duration,
      date: user.date,
      _id: user._id.toString()
    });
  });

});

// Gettin the log of all exercises
app.get("/api/users/:_id/logs", function(req, res) {
  console.log(req.query.limit)
  
  User.findById(req.params._id, function(err, user) {
    if (err) console.log(err);
    if (user == null) return console.log("user not found");
    console.log("retrieving logs")

    var minDate, maxDate;
    if (req.query.from) {
      minDate = new Date(req.query.from);
    } else {
      minDate = new Date(1970)
    }
    if (req.query.to) {
      maxDate = new Date(req.query.to);
    } else {
      maxDate = new Date();
    }

    var dateFilteredLog = user.log.filter((entry) => {
      var entryDate = new Date(entry.date);
      if (entryDate <= maxDate && entryDate >= minDate) {
        return entry;
      }
    });
    var returnLog = dateFilteredLog.slice(0, req.query.limit);

    return res.json({
      username: user.username,
      count: user.count,
      _id: user._id.toString(),
      log: returnLog
    });
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
