const express = require('express');
const router = express.Router();

// Get Homepage
router.get('/', checkAuth, (req, res) => {
  res.render('index');
});

function checkAuth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login')
  }
}

module.exports = router;