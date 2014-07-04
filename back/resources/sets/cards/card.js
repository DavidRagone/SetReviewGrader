// Get all cards for a set
exports.getIndex = function (req, res) {
  db.find('cards', {
    setId: req.params.setId
  }, function (err, data) {
    req.json(data);
  });
};

// TODO - determine how to populate database
