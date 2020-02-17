const db = require('./dbUtils');
const moment = require('moment');

async function processExams(exams) {
    let processedExams = [];
    const date = new Date();

    for (const exam of exams) {
        if (new Date(exam.date) > date) {
            let processedExam = {};
            let subject = await db.getResults("Academic", "Materias", { _id : db.getObjectID(exam.subject) });
            processedExam.subjectID = exam.subject;
            processedExam.subjectName = subject[0].long_name;
            processedExam.date = formatDate(exam.date);
            processedExams.push(processedExam);
        }
    }

    return processedExams;
}

function formatDate(date) {
    moment.locale('es');
    let dateObject = new moment(date);

    return dateObject.format("dddd DD/MM/YYYY - HH:mm");
}

module.exports = {
    loadExams: async function() {
        const exams = await db.getResults("Academic", "Examenes", {});
        const processedExams = await processExams(exams);

        vars.exams = processedExams;
    },

    newExam: async function(exam) {
        let object = {
            subject : db.getObjectID(exam.subject),
            date : new Date(exam.date),
            approved : false
        };

        await db.insert("Academic", "Examenes", object);
    }
};