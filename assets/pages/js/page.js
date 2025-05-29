$(".remove-action").click(function (e) { 
    e.preventDefault();
    $(".edit-action").removeClass("active");
    $(".table").removeClass("editable")
    $(this).toggleClass('active');
    $(".table").toggleClass("removeble")
    $(".row").removeClass("active")
    $(".remove-selected").toggleClass("active")
});
$.fn.hasEmpty = function() {
      if ($(this).html() !== "") {
        return false;
      } else {
        return true;
      }
  };
$.fn.hasAttr = function(name) {  
    return this.attr(name) !== undefined;
 };


function warning(text) {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "rgb(164, 53, 53)",
          opacity: "0.7"
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function alert(text) {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "rgb(164, 99, 53)",
          opacity: "0.7"
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function success(text) {
  Toastify({
      text: text,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "rgb(53, 164, 59)",
        opacity: "0.7"
      },
      onClick: function(){} // Callback after click
    }).showToast();
}