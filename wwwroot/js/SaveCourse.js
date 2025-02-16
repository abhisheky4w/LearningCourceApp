$(function () {
    $("#btnsave").on("click", function () {
        saveCourse();
    });
    $("#btnok").on("click", function () {
        window.location.href = '/Courses/Index'
    });
    $("input").on("input", function () {
        $(this).next(".text-danger").text("");
    });
    $("textarea").on("input", function () {
        $(this).next(".text-danger").text("");
    });
    
    $("#btnshowrecord").on("click", function () {
        window.location.href = '/Courses/Index'
    });

});

function saveCourse() {
    let name = $("#courseName").val().trim();
    let description = $("#courseDescription").val().trim();
    let price = $("#coursePrice").val().trim();
    let duration = $("#courseDuration").val().trim();

    $(".text-danger").text("");

    if (!name) {
        $("#courseNameError").text("Course name is required.");
        return;
    }
    if (!description) {
        $("#courseDescriptionError").text("Course description is required.");
        return;
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        $("#coursePriceError").text("Please enter a valid price.");
        return;
    }
    if (!duration || isNaN(duration) || duration <= 0 || duration > 1000) {
        $("#courseDurationError").text("Duration must be between 1 and 1000.");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/CourseManagementAPI/SaveCourse",
        contentType: "application/json",
        data: JSON.stringify({
            Name: name,
            Description: description,
            Price: parseFloat(price),
            Duration: parseInt(duration)
        }),
        success: function () {
            $('#okModalMessage').text('Data Saved Successfully');
            $('#okModal').modal('show');

        },
        error: function (xhr) {
            if (xhr.status === 400) {
                let response = xhr.responseJSON; 
                let errors = response.errors; 

                if (errors) {
                    if (errors.Name) $("#courseNameError").text(errors.Name[0]);
                    if (errors.Description) $("#courseDescriptionError").text(errors.Description[0]);
                    if (errors.Price) $("#coursePriceError").text(errors.Price[0]);
                    if (errors.Duration) $("#courseDurationError").text(errors.Duration[0]);
                }
            } else {
                alert("Failed to save course: " + xhr.responseText);
            }
        }
    });
}


