const db = require('./dbUtils');

function processSubjects(subjects) {
    let processedSubjects = [];

    for (const subject of subjects) {
        let processedSubject = {...subject};
        processedSubject.class = subject.approved ? "done" : "enabled";
        processedSubjects.push(processedSubject);
    }

    for (let subject of processedSubjects) {
        let disabled = false;

        for (const dependency of subject.dependencies) {
            const dep = subjects.find(obj => {
                return obj._id.toString() === dependency.toString();
            });

            if (!dep.approved) {
                disabled = true;
                break;
            }
        }

        if (disabled) {
            subject.class = "disabled";
        }
    }

    for (let subject of processedSubjects) {
        let dependents = processedSubjects.filter(obj => {
            return obj.dependencies.toString().includes(subject._id.toString());
        });

        subject.dependents = dependents.map(obj => obj._id);
    }

    return processedSubjects;
}

function processSemesters(subjects, semesters) {
    let processedSemesters = [];

    for (const semester of semesters) {
        let semesterSubjects = [];

        for (const semesterSubject of semester.subjects) {
            semesterSubjects.push(subjects.find(obj => {
                return obj._id.toString() === semesterSubject.toString();
            }));
        }

        let processedSemester = {
            number: semester.number,
            subjects: semesterSubjects
        };

        processedSemesters.push(processedSemester);
    }

    return processedSemesters;
}

module.exports = {
    loadSubjects: async function() {
        const subjects = await db.getResults("Academic", "Materias", {});
        const processedSubjects = processSubjects(subjects);
        const semesters = await db.getResults("Academic", "Semestres", {});

        vars.semesters = processSemesters(processedSubjects, semesters);
        vars.subjects = processedSubjects;
    },

    getPercentage: function() {
        const total = vars.subjects.length;
        let count = 0;

        for (const subject of vars.subjects) {
            if (subject.approved) {
                count++;
            }
        }

        vars.percentage = Math.round(count * 100 / total);
    }
};