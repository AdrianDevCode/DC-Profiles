$(function(){

// render students html
    const renderStudents = (students) => {
        let html = '';

        students.forEach((student) => {
        html += '<div class="card" style="width: 18rem;">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + student.fullName + '</h5>';
        html += '<p class="card-text">' + student.fullBio + '</p><hr><h6>Mission Statement</h6>';
        html += '<p class="card-text">' + student.missionStatement + '</p><h6>Email</h6>';
        html += '<h6 class="card-text">' + student.email + '</h6><hr>';
        html += '<a href="' + student.githubUrl + '"><i class="fab fa-github fa-2x"></i> </a>';
        html += '<a href="' + student.linkedinUrl + '"><i class="fab fa-linkedin fa-2x"></i> </a>';
        html += '<a href="' + student.portfolioUrl + '"><i class="fas fa-suitcase fa-2x"></i> </a>';
        html += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Showcase</button></div></div>'

        }); 
            return html;
    }
    // shuffle students in array
    const shuffleStudentData = (students) => {
        students.sort(() => {
             return 0.5 - Math.random() });
             return students;
    }

    // load student data from json
    const loadStudentData = (() => {
        $.get("https://s3.amazonaws.com/dc-profiles/Students.json", (data) => {
            let students = shuffleStudentData(data);
            let studentsHtml = renderStudents(students);
            $(".student-profiles").append(studentsHtml);
        });
    })();

});