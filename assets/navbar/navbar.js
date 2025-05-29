$(".btn-link").click(function (e) { 
    e.preventDefault();
    $(".btn-link").removeClass("active")
    $(this).addClass('active');
    loadPage($(this).attr("link"))
});
$(".link-move").click(function (e) { 
    e.preventDefault();
    loadPage($(this).attr("link"))
});
function loadPage(link) {
    var myNewURL = refineURL();
    window.history.pushState("", "", "/" + myNewURL );
    window.location.pathname = "admin/" + link + "/";
}
function refineURL()
{
    var currURL= window.location.href;
    var afterDomain= currURL.substring(currURL.lastIndexOf('/') + 1);
    var beforeQueryString= afterDomain.split("?")[0];  
 
    return beforeQueryString;     
}
$(".paginator-btn").click(function (e) { 
    e.preventDefault();
    $(".paginator-btn").removeClass("active")
    $(this).addClass('active');

    var page = $(this).attr("page");
});

function toggleMenuState() {
    $(".navbar").toggleClass("short");
    $(".page").toggleClass("short");
    $(".navbar").find(".title, p").toggle("show");

    const isMenuShort = $(".navbar").hasClass("short");
    localStorage.setItem("isMenuShort", JSON.stringify(isMenuShort));
}

$(document).ready(function() {
    const storedState = localStorage.getItem("isMenuShort");
    if (storedState) {
        const isMenuShort = JSON.parse(storedState);
        if (isMenuShort) {
            toggleMenuState();
        }
    }
});

$(".hide-menu").click(function(e) {
    e.preventDefault();
    toggleMenuState();
});

$(document).ready(function () {
    if(location.pathname.split("/")[2] != "") {
        $(".btn-link").removeClass("active");
        $(".btn-link").each(function (index, element) {
            if($(this).attr("link") == location.pathname.split("/")[2]) {
                $(this).addClass("active");
            }
        });
    }
});

const navbar = document.querySelector('.navbar');

$(window).change(function (e) { 
    e.preventDefault();
    navbar.style.height = $(this).height + 'px';
});