require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Compiling a model to store urls and shortened urls
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true }
});
let URL = mongoose.model("URL", urlSchema);  

// Creating a function to generate a random key for each url
function randomNumberGenerator() {
  let randomNumber = Math.floor((Math.random() * 10000)).toString();
  function checkForDuplicates() {
    URL.find({short_url: randomNumber}, (err, docs) => {
      if (err) return console.log(err);
      if (docs) {
        return true;
      } else {
        return false;
      }
    })
  }

  if (checkForDuplicates()) {
    randomNumberGenerator();
  }
  console.log(randomNumber);
  return randomNumber;
}

// Handling post requests
app.post("/api/:shorturl(*)", function(req, res) {
  let input = req.body.url;
  console.log(input);

  const validurlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  if (validurlRegex.test(input)) {
    console.log(input);
    let shortUrlKey = randomNumberGenerator();
    let output = {
      original_url: input.toString(),
      short_url: shortUrlKey
    }
    URL.create(output);
    res.json(output);
  } else {
    console.log(input);
    res.json({ error: 'invalid url' });
  }
})

// Redirecting to the original url
app.get("/api/:shorturl/*", function(req, res) {
  let shortUrlKey = req.params[0];
  console.log(shortUrlKey);

  URL.findOne({ short_url: shortUrlKey }, function (err, doc) {
    if (err) return console.log(err); 
    console.log(doc.toObject().short_url);
    console.log(doc.toObject().original_url);

    return res.redirect(doc.toObject().original_url);
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
