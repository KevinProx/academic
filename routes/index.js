const express = require('express');
const router = express.Router();
const subjects = require(process.cwd() + '/public/javascripts/subjects');
const exams = require(process.cwd() + '/public/javascripts/exams');

async function home(req, res) {
  vars.title = "Analista en Sistemas";
  await subjects.loadSubjects();
  await exams.loadExams();
  subjects.getPercentage();

  res.render('index', vars);
}

/* GET home page. */
router.get('/', home);

router.post('/', async function(req, res) {
  let name = req.body['sub-name'];
  let date = req.body['sub-date'];

  if (name !== 'none' && date !== '') {
    await exams.newExam({
      subject: name,
      date: date
    });
  }
  await home(req, res);
});

module.exports = router;
