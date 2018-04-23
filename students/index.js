$(function () {
    let dataBase;
    const combineDataAndPix = (students, pix) => {
        students.forEach((student, pictureIndex) => {
            student.picture = pix[pictureIndex].picture;
        });
        dataBase = students;
        return students;
    }

    // render students html
    const renderStudents = (students) => {
        let html = '';

        students.forEach((student) => {
            html += '<div class="card">';
            html += '<img class="card-img-top" src="' + student.picture.large + '">';
            html += '<div class="card-body">';
            html += '<h5 class="card-title">' + student.fullName + '</h5><hr>';
            html += '<button data-id="' + student.id + '" type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#info">Information</button>';
            html += '<button data-id='+ student.id +' type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#showcase">Showcase</button></div></div>';

        });
        return html;

    }

    const renderInformationModal = (studentInfo) => {
        let html = '';

        studentInfo.forEach((student) => {
            html += '<div class="modal fade" id="info" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
            html += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
            html += '<h5 class="modal-title" id="exampleModalLabel">' + student.firstName +'</h5>';
            html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            html += '</div><div class="modal-body"><p>' + student.fullBio + '</p><hr>';
            html +=  '<p>' + student.missionStatement + '</p><hr><h6>' + student.email + '</h6></div>';
            html += '<div class="modal-footer"><a href="' + student.githubUrl + '"><i class="fab fa-github fa-2x"></i></a>';
            html += '<a href="' + student.linkedinUrl + '"><i class="fab fa-linkedin fa-2x"></i> </a>';
            html += '<a href="' + student.portfolioUrl + '"><i class="fas fa-suitcase fa-2x"></i> </a></div></div></div></div>'; 
            
        });
        return html;
    }
    const renderShowcaseModal = (studentInfo) => {
        let html = '';
        let showcases = studentInfo.showcase;
        studentInfo.forEach((student) => {
            html += '<div class="modal fade" id="showcase" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
            html += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
            html += '<h5 class="modal-title" id="exampleModalLabel">'+ student.firstName +"'s Showcase</h5>";
            html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            html += '</div><div class="modal-body">'; 
            
        });
        showcases.forEach((showcase) => {
            html += '';

        });
        html += '</div></div></div>';
        return html;
    }


    // shuffle students in array
    const shuffleStudentData = (students) => {
        students.sort(() => {
            return 0.5 - Math.random()
        });
        return students;
    }
    // async function, have to use promise to return data when it is available
    const getStudentData = () => {
        return new Promise((resolve) => {
            $.get("https://s3.amazonaws.com/dc-profiles/Students.json", (data) => {
                let students = shuffleStudentData(data);
                resolve(students);
            });
        });
    }
    // async function, have to use promise to return data when it is available
    const getPictures = () => {
        return new Promise((resolve) => {
            $.get("https://randomuser.me/api/?inc=picture&results=21", (data) => {
                let studentPix = data.results;
                resolve(studentPix);
            });
        });
    }
    // load student data from json, this functions waits when data is available, then grabs data. 
    const loadStudentData = (async () => {
        let students = await getStudentData();
        let studentPix = await getPictures();
        let combinedData = combineDataAndPix(students, studentPix);
        let renderHTML = renderStudents(combinedData);
        $(".student-profiles").append(renderHTML);
    })();

// part of search form
    const searchedName = (search) => {
        let students = [];
        dataBase.forEach((student) => {
        let studentSearch = student.fullName.toLowerCase();
            if (studentSearch.includes(search)) {
                students.push(student);
            }
        });
        return students;
    }

    $("form").on("submit", function (e) {
        e.preventDefault();
        $(".student-profiles").empty();
        let search = $("input").val().toLowerCase();
        let studentSearch = searchedName(search);
        let renderHTML = renderStudents(studentSearch);
         $(".student-profiles").append(renderHTML);
    });

    const searchedId = (search) => {
        let studentInfo = [];
        dataBase.forEach((student) => {
        let studentSearch = student.id;
            if (studentSearch == search) {
                studentInfo.push(student);
            }
        });
        return studentInfo;
    }
// had to use function() instead of () => because this would not bind to button.
    $(".student-profiles").on("click", "button", function() { 
        let studentId = $(this).attr("data-id");
        let dataTarget = $(this).attr("data-target");
        $(".student-modal").empty();
        let student = searchedId(studentId);
        let renderHTML;
        if(dataTarget == "#info"){
            renderHTML = renderInformationModal(student);
        }else {
            renderHTML = renderShowcaseModal(student);
        }
         $(".student-modal").append(renderHTML);
    });

});