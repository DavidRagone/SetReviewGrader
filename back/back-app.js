var synth = require('synth');

var app = synth.app;

/* Define your middleware here */
app.use(function (req, res, next) {
  req.appName = "setReviewGrader";
  next();
});

module.exports = synth();
