const express = require('express');
const router = express.Router();
const subjects = require(process.cwd() + '/public/javascripts/subjects');

/* GET home page. */
router.get('/', async function(req, res, next) {
  vars.title = "Analista en Sistemas";
  await subjects.loadSubjects();
  subjects.getPercentage();

  res.render('index', vars);
});

module.exports = router;
