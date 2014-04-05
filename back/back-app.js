var synth = require('synth');

var app = synth.app;

/* Define your middleware here */
app.use(function (req, res, next) {
  req.appName = "set-review-grader";
  next();
});

module.exports = synth();
