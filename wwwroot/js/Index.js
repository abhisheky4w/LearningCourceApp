let currentPage = 1;
$(function () {
    loadCourses(1);
    $("#btnok").on("click", function () {
        window.location.href = '/Courses/Index'
    });
    
    $("#btnnewcourse").on("click", function () {
        window.location.href = '/Courses/InsertCourse'
    });
   
});

function loadCourses(pageNumber) {
    let pageSize = $("#pageSize").val(); 
    currentPage = pageNumber; 

    $.ajax({
        type: "GET",
        url: `/api/CourseManagementAPI/GetCourses?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        success: function (response) {
            let tableBody = $("#courseTableBody");
            tableBody.empty(); // Clear existing data
            let i = 1;
            response.courses.forEach(course => {
                let row = `<tr ondblclick="editCourse(${course.id}, '${course.name}', '${course.description}', ${course.price}, ${course.duration})">
                    <td>${i}</td>
                    <td>${course.name}</td>
                    <td>${course.description}</td>
                    <td>${course.price}</td>
                    <td>${course.duration}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})">Delete</button>
                    </td>
                </tr>`;
                tableBody.append(row);
                i++;
            });

            renderPagination(response.totalPages, response.currentPage);
        },
        error: function (xhr) {
            console.error("Error fetching courses:", xhr.responseText);
        }
    });
}

function renderPagination(totalPages, currentPage) {
    let paginationControls = $("#paginationControls");
    paginationControls.empty();

    for (let i = 1; i <= totalPages; i++) {
        let activeClass = i === currentPage ? "active" : "";
        paginationControls.append(
            `<li class="page-item ${activeClass}">
                <a class="page-link" href="#" onclick="loadCourses(${i})">${i}</a>
            </li>`
        );
    }
}


function editCourse(id, name, description, price, duration) {
    $("#courseId").val(id);
    $("#courseName").val(name);
    $("#courseDescription").val(description);
    $("#coursePrice").val(price);
    $("#courseDuration").val(duration);

    $("#courseModal").modal("show");
}


function deleteCourse(id) {
    if (!confirm("Are you sure you want to delete this course?")) {
        return;
    }

    $.ajax({
        url: "/api/CourseManagementAPI/DeleteCourse", 
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(id), 
        success: function () {
            $('#okModalMessage').text('Course deleted successfully!');
            $('#okModal').modal('show');

        },
        error: function (xhr, status, error) {
            alert("Error deleting course: " + xhr.responseText);
        }
    });
}




function closeModal() {
    document.getElementById("courseModal").style.display = "none";
}

function updateCourse() {
    let id = $("#courseId").val();
    let name = $("#courseName").val();
    let description = $("#courseDescription").val();
    let price = parseFloat($("#coursePrice").val());
    let duration = parseInt($("#courseDuration").val());

    if (!name || !description || isNaN(price) || isNaN(duration)) {
        alert("Please enter valid course details.");
        return;
    }

    $.ajax({
        url: "/api/CourseManagementAPI/UpdateCourse",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ Id: id, Name: name, Description: description, Price: price, Duration: duration }),
        success: function (response) {
            $("#courseModal").modal("hide");
            loadCourses(1);
        },
        error: function (xhr, status, error) {
            alert("Error updating course: " + error);
        }
    });
}

