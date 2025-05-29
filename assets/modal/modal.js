$(".modal-open").click(function (e) { 
    e.preventDefault();

    var modal_name = $(this).attr("name");

    if(modal_name != undefined) {
        $(".modal").each(function (index, element) {
            if($(this).attr("name") == modal_name) {
                $(this).addClass("active")
            }
        });
    }
});

$(".modal-close").click(function (e) { 
    e.preventDefault();
    
    var modal = $(this);
    while (!modal.hasClass("modal")) {
        modal = modal.parent();
    }

    modal.removeClass("active");
});

function createModal(name, title, content, close_btn = false) {
    if(!createdModal(name)) {
        if(close_btn) {
            $("body").prepend(
                `
                <div class="modal" name="${name}">
                <div class="modal-body">
                    <div class="modal-head">
                        ${title}
                    </div>
                    <div class="modal-content">
                        ${content}
                        <div class="d-flex justify-content-between" style="padding-top: 20px; flex-wrap: wrap;">
                        <button class="default-btn modal-close" onclick="closeModal('${name}')"><i class="fas fa-times" style="padding-right: 10px;" ></i>Закрити</button>
                    </div>
                    </div>
                </div>
                <div class="modal-blur"></div>
            </div>
                `
            );
        } else {
            $("body").prepend(
                `
                <div class="modal" name="${name}">
                <div class="modal-body">
                    <div class="modal-head">
                        ${title}
                    </div>
                    <div class="modal-content">
                        ${content}
                    </div>
                </div>
                <div class="modal-blur"></div>
            </div>
                `
            );
        }
    }
}

function createModalOpen(name, title, content, close_btn = false) {
    if(!createdModal(name)) {
        if(close_btn) {
            $("body").prepend(
                `
                <div class="modal" name="${name}">
                <div class="modal-body">
                    <div class="modal-head">
                        ${title}
                    </div>
                    <div class="modal-content">
                        ${content}
                        <div class="d-flex justify-content-between" style="padding-top: 20px; flex-wrap: wrap;">
                        <button class="default-btn modal-close" onclick="closeModal('${name}')"><i class="fas fa-times" style="padding-right: 10px;" ></i>Закрити</button>
                        </div>
                    </div>
                </div>
                <div class="modal-blur"></div>
            </div>
                `
            );
        } else {
            $("body").prepend(
                `
                <div class="modal" name="${name}">
                <div class="modal-body">
                    <div class="modal-head">
                        ${title}
                    </div>
                    <div class="modal-content">
                        ${content}
                    </div>
                </div>
                <div class="modal-blur"></div>
            </div>
                `
            );
        }
    }
    openModal(name);
}


function openModal(modal_name) {
    $(".modal").each(function (index, element) {
        if($(this).attr("name") == modal_name) {
            $(this).addClass("active")
        }
    });
}

function closeModal(modal_name) {
    $(".modal").each(function (index, element) {
        if($(this).attr("name") == modal_name) {
            $(this).removeClass("active")
        }
    });
}

function closeModalAll() {
    $(".modal").removeClass("active");
}

function createdModal(name) {
    result = false

    $(".modal").each(function (index, element) {
        if($(this).attr("name") == name) {
            result = true;
        }
    });

    return result;
}