function getCurrentLesson() {
    const lessonDuration = 90;
    const breakDuration = 20;
    const lessonsPerDay = 7;
    const startHour = 8;
  
    const currentTime = new Date();
    const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), startHour, 0, 0, 0);
    const elapsedMinutes = Math.floor((currentTime - startOfDay) / (1000 * 60));
  
    let lessonNumber = Math.floor(elapsedMinutes / (lessonDuration + breakDuration)) + 1;
    
    if (lessonNumber < 1) {
        lessonNumber = 1;
    } else if (lessonNumber > lessonsPerDay) {
        lessonNumber = lessonsPerDay;
    }
  
    if (elapsedMinutes >= (lessonDuration + breakDuration) * lessonsPerDay) {
        lessonNumber = lessonsPerDay;
    }
  
    return {
        lessonNumber: lessonNumber,
        isBreak: lessonNumber % 2 === 0
    };
}
function scrollToElement(elementSelector) {
    const $element = $(elementSelector);
    
    // Прокрутка по вертикали
    $('.border').animate({
        scrollTop: $element.offset().top
    }, 1000);

    // Прокрутка по горизонтали
    $('.border').animate({
        scrollLeft: $element.offset().left
    }, 1000);
}
function applyFilters(onLoad) {
    var type = $("select[name='type']").val();
    var course = $("select[name='courses']").val();
    var group = $("select[name='groups']").val();
    var selectedDay = datePicker.date.date;
    var selectedMonth = datePicker.date.monthNumber;
    var selectedYear = datePicker.date.year;
    
    var selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    var formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}`;

    if(!onLoad) {
        $.ajax({
            type: "POST",
            url: "/api/public/filter",
            data: {
                type: type,
                date: formattedDate
            },
            dataType: "JSON",
            success: function (response) {
                if(response.error) {
                    $(".border").empty();
                    $(".border").html(response.html);
                    $(".date").text("?????, ?? ??????");
                } else {
                    $(".border").empty();
                    $(".border").html(response.html);

                    if (course !== "none") {
                        if (group !== "none") {
                            $.each($("table tbody tr").find("td"), function (indexInArray, element) { 
                                var move = $(element).find(".move");
                                if (move.length !== 0) {
                                    if (parseInt(move.data("course")) !== parseInt(course) || move.data("group") !== group) {
                                        move.fadeOut();
                                    }
                                }
                            });
                        } else {
                            $.each($("table tbody tr").find("td"), function (indexInArray, element) { 
                                var move = $(element).find(".move");
                                if (move.length !== 0 && parseInt(move.data("course")) !== parseInt(course)) {
                                    move.fadeOut();
                                }
                            });
                        }
                    }
                    

                    var date = response.date;
                    var formattedDate2 = moment(formattedDate).locale('uk').format('dddd, D MMMM');

                    if(formattedDate2 == "Invalid date") {
                        formattedDate2 = date;
                    }
                    $(".date").text(formattedDate2);
                    $(".border table").find("tr.lesson").find("td.number-lesson").each(function (index, element) {
                        if($(element).data("lesson") == getCurrentLesson().lessonNumber.toString()) {
                            $(element).addClass("active");
                        }
                    });
             
                }
                toggleFilterDown();
            }
        });
    }
}
$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/api/public/last",
        data: {
            type: "phys"
        },
        dataType: "json",
        success: function (response) {
            $(".border").empty();
            $(".border").html(response.data);

            var date = response.date;
            var formattedDate = moment(date).locale('uk').format('dddd, D MMMM');
            if(formattedDate == "Invalid date") {
                formattedDate = date;
            }
            $(".date").text(formattedDate);
            $(".border table").find("tr.lesson").find("td.number-lesson").each(function (index, element) {
                if($(element).data("lesson") == getCurrentLesson().lessonNumber.toString()) {
                    $(element).addClass("active");
                }
            });
        }
    });
    $.ajax({
        type: "POST",
        url: "/api/public/courses",
        data: {
            type: "phys"
        },
        dataType: "text",
        success: function (response) {
            if(response != "") {
                $("select[name='courses'").html(`<option value="none">Оберіть курс</option>`);
                $("select[name='courses']").append(response);
            }
        }
    });
    $("select[name='courses']").change(function (e) { 
        e.preventDefault();
    
        if($("select[name='type']").val() != "none" && $(this).val() != "none") {
            $.ajax({
                type: "POST",
                url: "/api/public/groups",
                data: {
                    type: $("select[name='type']").val(),
                    course: $(this).val()
                },
                dataType: "text",
                success: function (response) {
                    if(response != "") {
                        $("select[name='groups']").html(`<option value="none">Оберіть групу</option>`);
                        $("select[name='groups']").append(response);
                    }
                }
            });
        } else {
            $("select[name='groups']").html(`<option value="none">Оберіть групу</option>`);
        }
    });
    $("select[name='type']").change(function (e) { 
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/public/courses",
            data: {
                type: $(this).val()
            },
            dataType: "text",
            success: function (response) {
                if(response != "") {
                    $("select[name='courses']").html(`<option value="none">Оберіть курс</option>`);
                    $("select[name='courses']").append(response);
                }
            }
        });
        $.ajax({
            type: "POST",
            url: "/api/public/last",
            data: {
                type: $(this).val()
            },
            dataType: "json",
            success: function (response) {

                $(".border").empty();
                $(".border").html(response.data);

                var date = response.date;
                var formattedDate = moment(date).locale('uk').format('dddd, D MMMM');
                if(formattedDate == "Invalid date") {
                    formattedDate = date;
                }
                $(".date").text(formattedDate);
                $(".border table").find("tr.lesson").find("td.number-lesson").each(function (index, element) {
                    if($(element).data("lesson") == getCurrentLesson().lessonNumber.toString()) {
                        $(element).addClass("active");
                    }
                });
            }
        });
    });

    let el = document.querySelector(".border");
    let x = 0, y = 0, top = 0, left = 0;
    
    let draggingFunction = (e) => {
        document.addEventListener('mouseup', () => {
            document.removeEventListener("mousemove", draggingFunction);
        });
    
        el.scrollLeft = left - e.pageX + x;
        el.scrollTop = top - e.pageY + y;
    };
    
    el.addEventListener('mousedown', (e) => {
        e.preventDefault();
    
        y = e.pageY;
        x = e.pageX;
        top = el.scrollTop;
        left = el.scrollLeft;
    
        document.addEventListener('mousemove', draggingFunction);
    });
    
    var updateScrollPos = function(e) {
        $('html').css('cursor', 'row-resize');
        $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
    }
});

$(".dropdown-button").click(function (e) { 
    e.preventDefault();
    $(this).parent().toggleClass("active");
    
    var dropdownContent = $(".dropdown-content").toggleClass("active");
    if (dropdownContent.length !== 0) {
        if ($(this).parent().hasClass("active")) {
            var maxHeight = dropdownContent.prop("scrollHeight");
            dropdownContent.css("max-height", maxHeight+50 + "px");
            dropdownContent.css("opacity", "1");
            blurTable(true)
        } else {
            dropdownContent.css("opacity", "0");
            dropdownContent.css("max-height", "");
            blurTable(false)
        }
    }
});
function toggleFilterDown() {
    $(".dropdown").toggleClass('active');
    var dropdownContent = $(".dropdown-content").toggleClass("active");
    if (dropdownContent.length !== 0) {
        if ($(this).parent().hasClass("active")) {
            var maxHeight = dropdownContent.prop("scrollHeight");
            dropdownContent.css("max-height", maxHeight+50 + "px");
            dropdownContent.css("opacity", "1");
            blurTable(true)
        } else {
            dropdownContent.css("opacity", "0");
            dropdownContent.css("max-height", "");
            blurTable(false)
        }
    }
}
function blurTable(bool) {
    var border = $(".border")
    if (bool) {
        border.addClass("blur")
    }
    else {
        border.removeClass("blur")
    }
}
$(document).click(function (e) { 
    e.preventDefault();
    var target = $(e.target);

    if (!target.hasClass("dropbtn") && !target.hasClass("dropdown-button") && target.closest(".dropdown-content").length === 0) {
        var dropdownContent = $(".dropdown-content");
        dropdownContent.css("opacity", "0");
        dropdownContent.css("max-height", "0");
        blurTable(false);
    }
});

$(".checkbox").click(function (e) { 
    e.preventDefault();
    $(".checkbox-icon").find("i").toggleClass("active");
});

function getStatusCheck() {
    return $(".checkbox-icon").find("i").hasClass("active")
}

$(".set-filter").click(function (e) { 
    e.preventDefault();
    applyFilters(false);

});
$(".delete-filter").click(function (e) { 
    e.preventDefault();
    $.each($("table tbody tr").find("td"), function (indexInArray, element) { 
        var move = $(element).find(".move");
        if (move.length !== 0) {
            move.fadeIn();
        }
    });
    toggleFilterDown();
    localStorage.removeItem("filters", [group, course, teacher])
});


function getActiveLesson(number) {
    return number == getCurrentLesson.lessonNumber;
}