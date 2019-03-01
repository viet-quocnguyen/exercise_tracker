const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const key = require("./config/key");
const User = require("./models/User");
const Exercise = require("./models/Exercise");
// Basic configuration
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/views"));
// Connect to database
const mongoURL = key.mongoURL;
mongoose.connect(mongoURL);

app.get("/", (req, res) => {
  res.render("index.html");
});
app.post("/api/exercise/new-user", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.json({
        error: err
      });
    }
    if (user) {
      res.json({
        user: "This user is already exist in the database"
      });
    } else {
      let newUser = new User({
        username: req.body.username
      });
      newUser.save();
      res.json(newUser);
    }
  });
});
app.post("/api/exercise/add", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.json({
        error: err
      });
    }
    if (user) {
      let newExercise = new Exercise({
        userId: user._id,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date
      });
      newExercise.save().then(user => {
        res.json(user);
      });
    } else {
      res.json({
        error: "Username does not exist"
      });
    }
  });
});

app.get("/api/exercise/log/:username/:from*?/:to*?/:number*?", (req, res) => {
  let username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.json({
        error: err
      });
    }
    Exercise.find({ userId: user._id }, (err, exercise) => {
      if (err) {
        res.json(err);
      }
      if (exercise) {
        res.json({
          exercise: exercise
        });
      } else {
        res.json({
          error: "Username does not exist"
        });
      }
    });
  });
});
// Set up port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
