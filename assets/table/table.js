$(function () {
    $(document).on("click", ".lock-cell", function (e) {
        e.preventDefault();
        if($(this).parent().parent().parent().hasClass("lock")) {
            $(this).parent().parent().parent().removeClass("lock");
        } else {
            $(this).parent().parent().parent().addClass("lock");
        }
    });
    $('.lessons-table tbody tr td:not(.number-lesson)').hover(
        function () {
            if(!$(this).hasClass("number-lesson")) {
                if($(this).find(".move").length == 0) {
                    var buttonContainer = $('<div class="button-container active"></div>');
                    buttonContainer.append(`            <button class='default-btn add' onclick=""><i class="fas fa-plus"></i></button>
                <button class='remove default-btn'><i class="fas fa-minus"></i></button>    `);
                    $(this).prepend(buttonContainer);
                }
                $(this).find(".counter").remove();
            }

        },
        function () {
            if(!$(this).hasClass("number-lesson")) {
                $(this).find('.button-container').remove();
            }

            function getCorrectEnding(number, one, few, many) {
                if (number % 10 === 1 && number % 100 !== 11) {
                    return one;
                } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
                    return few;
                } else {
                    return many;
                }
            }

            if ($(this).find(".move").length > 1) {
                if ($(this).find(".counter").length == 0) {
                    var elementsCount = $(this).find(".move").length;
                    var ending = getCorrectEnding(elementsCount-1, 'елемент', 'елемента', 'елементів');
                    $(this).append("<p class='counter'>та ще " + (elementsCount-1) + " " + ending + "</p>");
                } else {
                    var elementsCount = $(this).find(".move").length;
                    var ending = getCorrectEnding(elementsCount-1, 'елемент', 'елемента', 'елементів');
                    $(this).find(".counter").text("та ще " + (elementsCount-1) + " " + ending);
                }
            }

        }
    );
    $(document).on("click", ".remove-move", function (e) {
        e.preventDefault();
        
        var copy = $(this).parent().parent().parent().clone();
        var move = $(this).parent().parent().parent().parent();
        addToHistory("remove-cell", move);
        console.log($(this).parent().parent().parent());
        $(this).parent().parent().parent().remove();
        alert("Комірка видалена! CTRL + Z, щоб відмінити дію");

        $(".removed-comir").click(function (e) { 
            e.preventDefault();
                $(this).removeClass("on");
        });
    });
    $(document).on("click", ".add", function (e) {
        e.preventDefault();

        var td = $(this).closest("td");

        var indexTd = getCountColumn(td);
        var currentColspan = parseInt(td.attr("colspan")) || 1;
        var maxColspan = td.parent().find("td").length;

        if (td.attr("next-colspan") == undefined) {
            td.attr("next-colspan", 2);
        }

        var allow_add = false;
        var nextTd = td.next("td");
        for (let index = 0; index < currentColspan; index++) {
            if (nextTd.length == 0) {
                warning("Помилка! Неможливо розширити елемент: Закінчились клітинки!");
                allow_add = false;
                break;
            }

            if (nextTd.find(".move").length == 0 && (!nextTd.attr("colspan") || nextTd.attr("colspan") == 1)) {
                allow_add = true;
                td.find(".move").css("font-size", "1em");
                td.addClass("shared");
                nextTd.addClass("d-none");
            } else {
                warning("Помилка! Неможливо розширити елемент");
                allow_add = false;
            }

            nextTd = nextTd.next("td");
        }



        if (allow_add) {
            var nextColspan = parseInt(td.attr("next-colspan"));
            if (indexTd < (maxColspan - 1)) {
                td.attr("colspan", nextColspan);
                td.attr("next-colspan", nextColspan + 1);
                addToHistory("add-colspan", td);
            }
        }
    });
    function addColspan(td) {
        var indexTd = getCountColumn(td);
        var currentColspan = parseInt(td.attr("colspan")) || 1;
        var maxColspan = td.parent().find("td").length;

        if (td.attr("next-colspan") == undefined) {
            td.attr("next-colspan", 2);
        }

        var allow_add = false;
        var nextTd = td.next("td");
        for (let index = 0; index < currentColspan; index++) {
            if (nextTd.length == 0) {
                warning("Помилка! Неможливо розширити елемент: Закінчились клітинки!");
                break;
            }

            if (nextTd.find(".move").length == 0 && (!nextTd.attr("colspan") || nextTd.attr("colspan") == 1)) {
                allow_add = true;
                td.find(".move").css("font-size", "1em");
                td.addClass("shared");
                nextTd.addClass("d-none");
            } else {
                warning("Помилка! Неможливо розширити елемент");
                allow_add = false;
            }

            nextTd = nextTd.next("td");
        }



        if (allow_add) {
            var nextColspan = parseInt(td.attr("next-colspan"));
            if (indexTd < (maxColspan - 1)) {
                td.attr("colspan", nextColspan);
                td.attr("next-colspan", nextColspan + 1);
                // addToHistory("add-colspan", td);
            }
        }
    }
    function removeColspan(td) {
        var currentColspan = parseInt(td.attr("colspan")) || 1;

        if (currentColspan > 1) {
            td.attr("colspan", currentColspan - 1);
            td.attr("next-colspan", td.attr("next-colspan") - 1);
            if (currentColspan < 2) {
                td.removeClass("shared");
                td.attr("next-colspan", 2);
                td.find(".move").css("font-size", "0.9em");
            }

            var hided_total = td.nextAll("td.d-none");
            var hided_last_elem = hided_total.eq(currentColspan - 2);

            if (hided_last_elem.length > 0) {
                $(hided_last_elem).removeClass("d-none");
            }
        }
    }
    $(document).on("change", "select[name='teacherSelect']", function (e) {
        e.preventDefault();
        $("input[name='email'").val($(this).find("option:selected").attr("email"));
    });
    $(document).on("click", ".remove", function (e) {
        e.preventDefault();

        var td = $(this).closest("td");
        var currentColspan = parseInt(td.attr("colspan")) || 1;

        if (currentColspan > 1) {
            td.attr("colspan", currentColspan - 1);
            td.attr("next-colspan", td.attr("next-colspan") - 1);
            if (currentColspan < 2) {
                td.removeClass("shared");
                td.attr("next-colspan", 2);
                td.find(".move").css("font-size", "0.9em");
            }

            var hided_total = td.nextAll("td.d-none");
            var hided_last_elem = hided_total.eq(currentColspan - 2);

            if (hided_last_elem.length > 0) {
                $(hided_last_elem).removeClass("d-none");
            }

            addToHistory("remove-colspan", td);
        }
    });


    $(".lessons-table tbody tr td:not(.number-lesson)").click(function (e) { 
        e.preventDefault();
        $(".lessons-table tbody tr td:not(.number-lesson)").removeClass("selected");
        $(this).addClass("selected");
    });
    $(".draggable-table tbody").sortable({
        connectWith: ".lessons-table tbody tr td:not(.number-lesson)",
        cursor: "move",
        helper: "clone",
        start: function (event, ui) {
            ui.helper.addClass("dragging");
        },
    });
    $(".lessons-table tbody tr td:not(.number-lesson)").sortable({
        cursor: "move",
        connectWith: ".lessons-table tbody tr td",
        receive: function (event, ui) {
            var targetCell = $(event.target);

            if (targetCell.children().length == 1) {
                if (!ui.sender.closest("table").is(targetCell.closest("table"))) {
                    replaceItem(targetCell, ui.item.clone(), ui.sender);
                    addToHistory("paste", targetCell)
                } else {
                    if(ui.sender.prop("tagName") == "TD") {
                        if(ui.sender.find(".move").length == 0) {
                            addToHistory("move", ui.sender,targetCell);
                        } else {
                            if(ui.sender.find(".move").length == 1) {
                                ui.sender.removeClass("d-flex");
                            }
                            console.log("uncelling");
                            addToHistory("uncell", ui.sender,targetCell, ui.item);
                        }
                    }
                }

                if(ui.item.find(".controls").children().first().hasClass("hide")) {
                    ui.item.find(".controls").children().first().removeClass("hide")
                }
            } else {
                var move_target = targetCell.find(".move");
                var move = ui.item;
                var categorical = move_target.length != 0 && move.hasAttr("categorical") 
                && move_target.hasAttr("categorical")
                && !$(move_target[0]).is(move);
                if(categorical) {
                    if(ui.sender.prop("tagName") == "TBODY") {
                        linkCell(targetCell, ui.item.clone(), ui.sender);
                        ui.sender.sortable('cancel');
                    } else {
                        linkCell(targetCell);
                    }

                    console.log("celling");
                    addToHistory("cell", ui.sender,targetCell, ui.item);
                } else {
                    ui.sender.sortable('cancel');
                }
            }

            $(".lessons-table tbody tr td:not(.number-lesson)").removeClass("selected");
            targetCell.addClass("selected");
        },
        over: function (event, ui) {
            var targetCell = $(event.target);
            var colspan = parseInt(targetCell.attr("colspan")) || 1;

            var move_target = targetCell.find(".move");
            var move = ui.item;
            var categorical = move_target.length != 0 && move.hasAttr("categorical") 
            && move_target.hasAttr("categorical")
            && !$(move_target[0]).is(move);

            if (targetCell.children().length + colspan - 1 > 1 && !categorical) {
                $(event.target).css("background-color", "rgba(164, 53, 53, 0.579);");
            } else {
                $(event.target).css("background-color", "rgba(53, 164, 70, 0.579)");
            }
        },
        out: function (event, ui) {
            $(event.target).attr("style", "");
        },
        items: ".move:not(.lock)"
    });


    // Обробник події для клавіші Ctrl + C
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 67) { // 67 - код клавіші "C"
            // Викликати функцію копіювання, якщо вибрано <td>
            var selectedCell = $(".lessons-table tbody td.selected");
            if (selectedCell.length && selectedCell.is('td')) {
                if(selectedCell.find(".move").length != 0) {
                    // redoHistory = [];
                    success("Успішно! Комірку додано до буферу обміну!")
                    copyItem(selectedCell);
                } else {
                    alert("Попередження! Немає нічого до копіювання")
                }
            }
        }
    });

    // Обробник події для клавіші Ctrl + V
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 86) { // 86 - код клавіші "V"
            // Викликати функцію вставки, якщо вибрано <td>
            var selectedCell = $(".lessons-table tbody td.selected");
            if (selectedCell.length && selectedCell.is('td')) {
                if(selectedCell.find(".move").length == 0) {
                    pasteItem(selectedCell);
                } else {
                    warning("Помилка! Комірка зайнята")
                }
            }
        }
    });

    var copiedItem = null;
    function copyItem(selectedCell) {
        // Збереження вибраного елемента для подальшого використання
        copiedItem = selectedCell.find(".move").clone();
    }

    function pasteItem(selectedCell) {
        if (copiedItem) {
            // Вставка клонованого елемента в обрану ячейку
            var clonedItem = copiedItem.clone();
            selectedCell.append(clonedItem);
            addToHistory("paste", selectedCell);
            selectedCell.find('.button-container').remove();
        }
    }

    // Обробник події для клавіші Ctrl + Z
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 90) { // 90 - код клавіші "Z"
            undoLastAction();
        }
    });

    // Обробник події для клавіші Ctrl + Y
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 89) { // 89 - код клавіші "Y"
            redoLastAction();
        }
    });

    var actionHistory = [];
    var redoHistory = [];
    function addToHistory(action, cell, receive_cell = null, item = null) {
        actionHistory.push({ action: action, cell: cell, content: cell.find(".move").clone(), item: item, receive_cell: receive_cell });
    }

    function undoLastAction() {
        if (actionHistory.length > 0) {
            var lastAction = actionHistory.pop();
            if (lastAction.action == 'remove-cell') {
                if(!lastAction.cell.hasClass("d-none")) {
                    lastAction.cell.html(lastAction.content);
                    success("Успішно! Дія відмінена");
                    redoHistory.push(lastAction);
                } else {
                    warning("Неможливо повернути дію! ");
                }
            } else if (lastAction.action == 'paste') {
                if(!lastAction.cell.hasClass("d-none")) {
                    lastAction.cell.find('.move').last().remove();
                    success("Успішно! Дія відмінена");
                    redoHistory.push(lastAction);
                } else {
                    warning("Неможливо повернути дію! ");
                }
            } else if (lastAction.action == 'add-colspan') { 
                removeColspan(lastAction.cell);
                success("Успішно! Дія відмінена");
                redoHistory.push(lastAction);
            } else if (lastAction.action == 'remove-colspan') { 
                addColspan(lastAction.cell);
                success("Успішно! Дія відмінена");
                redoHistory.push(lastAction);
            } else if (lastAction.action == 'move') { 
                if(lastAction.cell.find(".move").length == 0) {
                    $(".lessons-table tbody tr td:not(.number-lesson)").removeClass("selected");
                    $(lastAction.cell).addClass("selected");
                    lastAction.cell.html(lastAction.receive_cell.find(".move"));
                    lastAction.receive_cell.empty()
                    success("Успішно! Дія відмінена");
                    redoHistory.push(lastAction);
                } else {
                    warning("Неможливо виконати відміну: Комірка занята");
                }
            } else if (lastAction.action == 'cell') { 
                var move = lastAction.receive_cell.find(lastAction.item);
                if(lastAction.cell.find(".move").hasAttr("categorical") || lastAction.cell.find(".move").length == 0) {
                    lastAction.cell.append(move)
                    lastAction.receive_cell.remove(move);

                    success("Успішно! Дія відмінена");
                    redoHistory.push(lastAction);
                } else {
                    warning("Неможливо виконати відміну!");
                }
            }
        } else {
            warning("Немає дій до відміни!");
        }
    }
    function redoLastAction() {
        if (redoHistory.length > 0) {
            var lastRedoAction = redoHistory.pop();
            if (lastRedoAction.action == 'remove-cell') {
                if(!lastRedoAction.cell.hasClass("d-none")) {
                    lastRedoAction.cell.empty();
                    success("Успішно! Дія відновлена");
                    // Додаємо в історію відмін для можливості їх відміни
                    actionHistory.push(lastRedoAction);
                } else {
                    warning("Неможливо відновити дію! ");
                }
            } else if (lastRedoAction.action == 'paste') {
                // Дія повторення останньої вставленої клітинки
                if(!lastRedoAction.cell.hasClass("d-none")) {
                    lastRedoAction.cell.html(lastRedoAction.content);
                    success("Успішно! Дія відновлена");
                    // Додаємо в історію відмін для можливості їх відміни
                    actionHistory.push(lastRedoAction);
                } else {
                    warning("Неможливо відновити дію! ");
                }
            } else if (lastRedoAction.action == 'add-colspan') { 
                addColspan(lastRedoAction.cell);
                success("Успішно! Дія відновлена");
                // Додаємо в історію відмін для можливості їх відміни
                actionHistory.push(lastRedoAction);
            } else if (lastRedoAction.action == 'remove-colspan') { 
                removeColspan(lastRedoAction.cell);
                success("Успішно! Дія відновлена");
                actionHistory.push(lastRedoAction);
            } else if(lastRedoAction.action == "move") {
                if(lastRedoAction.receive_cell.find(".move").length == 0) {
                    $(".lessons-table tbody tr td:not(.number-lesson)").removeClass("selected");
                    lastRedoAction.receive_cell.addClass("selected");
                    lastRedoAction.receive_cell.html(lastRedoAction.cell.find(".move"));
                    lastRedoAction.cell.empty();
                    success("Успішно! Дія відмінена");
                    actionHistory.push(lastRedoAction);
                } else {
                    warning("Неможливо виконати відновлення: Комірка занята");
                }
            } else if (lastRedoAction.action == 'cell') { 
                var move = lastRedoAction.cell.find(lastRedoAction.item);
                if(lastRedoAction.receive_cell.find(".move").hasAttr("categorical") || lastRedoAction.receive_cell.find(".move").length == 0) {
                    lastRedoAction.receive_cell.append(move)
                    lastRedoAction.cell.remove(move);

                    success("Успішно! Дія відновлена");
                    actionHistory.push(lastRedoAction);
                } else {
                    warning("Неможливо виконати відновлення!");
                }
            }
        } else {
            warning("Немає дій до відновлення!");
        }
    }
    $(document).on("click", ".teach-btn", function (e) {
        e.preventDefault();
        $(this).addClass("active");
        
        if($(this).hasClass("teach-online")) {
            $(this).parent().find(".teach-offline").removeClass("active");
            $($(this).parent().parent().next(".additionalInfo").find(".wrapper").children()[1]).css("display", "block");
            $($(this).parent().parent().next(".additionalInfo").find(".wrapper").children()[0]).css("display", "none");
        } else {
            $(this).parent().find(".teach-online").removeClass("active");
            $($(this).parent().parent().next(".additionalInfo").find(".wrapper").children()[0]).css("display", "block");
            $($(this).parent().parent().next(".additionalInfo").find(".wrapper").children()[1]).css("display", "none");
        }
    });

    function getTeacherOptions(array, array2) {
        var elem = ""
        for (let index = 0; index < array.length; index++) {
            elem += `<option email="${array2[index]}" >${array[index]}</option>`;
        }

        return elem;
    }

    function replaceItem(rootelem, elem, senderelem) {
        senderelem.append(elem);

        var d_name = elem.attr("dname");
        var d_teach = elem.attr("dteach");
        var d_emails = elem.attr("demails");


        if(d_teach.split(";").length == 2) {
            var d_teach = `
            
            <select id="selectTeach" class="input" name="teacherSelect">
                ${getTeacherOptions(d_teach.split(";"), d_emails.split(";"))}
            </select>
            
            `;
        }


        const hasCategorical = elem.hasAttr("categorical");
        var elem = $(`<div class='move'>
                    <div class="d-flex justify-content-between align-center controls">
                        <div class="cell">
                            <button class='default-btn add' onclick=""><i class="fas fa-plus"></i></button>
                            <button class='remove default-btn'><i class="fas fa-minus"></i></button>    
                        </div>
                        <div class="type-lesson" style="text-align: end;">
                            <label for="lessonType">Тип заняття:</label>
                            <select id="lessonTypeSelect" class="input" name="lessonType">
                                <option value="lection" title="Лекція">Лекція</option>
                                <option value="practice" title="Практика">Практика</option>
                                <option value="laboratory" title="Лабораторне заняття">Лабораторне заняття</option>
                                <option value="consultation" title="Консультація">Консультація</option>
                                <option value="examination-consultation" title="Екзаменаційна консультація">Екзаменаційна консультація</option>
                                <option value="check-control-works" title="Перевірка контр. робіт, РГР">Перевірка контр. робіт, РГР</option>
                                <option value="course-works" title="Курсові роботи">Курсові роботи</option>
                                <option value="examination" title="Екзамени">Екзамени</option>
                                <option value="practice-guidance" title="Керівництво практикою">Керівництво практикою</option>
                                <option value="state-examination" title="Державні іспити">Державні іспити</option>
                                <option value="qualification-works" title="Кваліфікаційні роботи">Кваліфікаційні роботи</option>
                                <option value="guidance-graduate-students" title="Керівництво аспірантами">Керівництво аспірантами</option>
                            </select>
                        </div>
                    </div>
                    <div class="info" style="padding: 5px;">
                        <div class="header text-center">
                            <h4>${d_name}</h4>
                            <p>${d_teach}</p>
                        </div>
                        <div class="options w-100 text-center" style="padding-top: 10px;">
                            <p style="margin: 0; padding: 0;">Форма навчання:</p>
                            <div class="teach-form">
                                <button class="teach-btn teach-offline btn active">Офлайн</button>
                                <button class="teach-btn teach-online btn">Онлайн</button>
                            </div>
                        </div>
                        <div class="additionalInfo text-center">
                            <div class="wrapper">
                                <div id="offlineInfo" style="display: block;">
                                    <label for="classroomNumber">Номер аудиторії:</label>
                                    <input type="text" id="classroomNumber" class="input" name="classroomNumber">
                                </div>
                                <div id="onlineInfo" style="display: none;">
                                    <label for="email">Електронна пошта:</label>
                                    <input type="email" class="input" id="email" name="email" value="${d_emails.split(";")[0]}">
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="d-flex justify-content-between">
                            <div style="text-align: start;">
                            <button class="default-btn remove-move" style=" padding: 8px;"><i class="fas fa-trash"></i> </button>
                            </div>
                            <div style="text-align: end;">
                            <button class="default-btn lock-cell" style=" padding: 8px;"><i class="fas fa-lock"></i><i class="fas fa-unlock"></i></button>
                            </div>
                        </div>
                </div>`);
        if(hasCategorical) {
            elem.attr("categorical", "1");
        }
        
    rootelem.html(elem);
                var defaultType = getDefaultType();
                rootelem.find('.type-lesson').find("select[name='lessonType']").find("option[value='"+defaultType+"']").prop("selected", true)
                var defaultForm = getDefaultForm();

                // Зміна класів та видимості в залежності від значення за замовчуванням
                if (defaultForm == "offline") {
                    rootelem.find('.teach-form .teach-offline').addClass('active');
                    rootelem.find('.teach-form .teach-online').removeClass('active');
                    rootelem.find('#offlineInfo').show();
                    rootelem.find('#onlineInfo').hide();
                } else {
                    rootelem.find('.teach-form .teach-offline').removeClass('active');
                    rootelem.find('.teach-form .teach-online').addClass('active');
                    rootelem.find('#offlineInfo').hide();
                    rootelem.find('#onlineInfo').show();
                }
    }

    function linkCell(rootelem, elem = null, senderelem = null) {
        if(elem != null & senderelem != null) {
            var d_name = elem.attr("dname");
            var d_teach = elem.attr("dteach");

            var d_emails = elem.attr("demails");


            if(d_teach.split(";").length == 2) {
                var d_teach = `
                
                <select id="selectTeach" class="input" name="teacherSelect">
                    ${getTeacherOptions(d_teach.split(";"), d_emails.split(";"))}
                </select>
                
                `;
            }

            if(senderelem.prop("tagName") == "TBODY") {
                const hasCategorical = elem.hasAttr("categorical");
                var elem = $(`<div class='move'>
                    <div class="d-flex justify-content-between align-center controls">
                        <div class="cell">
                            <button class='default-btn add' onclick=""><i class="fas fa-plus"></i></button>
                            <button class='remove default-btn'><i class="fas fa-minus"></i></button>    
                        </div>
                        <div class="type-lesson" style="text-align: end;">
                            <label for="lessonType">Тип заняття:</label>
                            <select id="lessonTypeSelect" class="input" name="lessonType">
                                <option value="lection" title="Лекція">Лекція</option>
                                <option value="practice" title="Практика">Практика</option>
                                <option value="laboratory" title="Лабораторне заняття">Лабораторне заняття</option>
                                <option value="consultation" title="Консультація">Консультація</option>
                                <option value="examination-consultation" title="Екзаменаційна консультація">Екзаменаційна консультація</option>
                                <option value="check-control-works" title="Перевірка контр. робіт, РГР">Перевірка контр. робіт, РГР</option>
                                <option value="course-works" title="Курсові роботи">Курсові роботи</option>
                                <option value="examination" title="Екзамени">Екзамени</option>
                                <option value="practice-guidance" title="Керівництво практикою">Керівництво практикою</option>
                                <option value="state-examination" title="Державні іспити">Державні іспити</option>
                                <option value="qualification-works" title="Кваліфікаційні роботи">Кваліфікаційні роботи</option>
                                <option value="guidance-graduate-students" title="Керівництво аспірантами">Керівництво аспірантами</option>
                            </select>
                        </div>
                    </div>
                    <div class="info" style="padding: 5px;">
                        <div class="header text-center">
                            <h4>${d_name}</h4>
                            <p>${d_teach}</p>
                        </div>
                        <div class="options w-100 text-center" style="padding-top: 10px;">
                            <p style="margin: 0; padding: 0;">Форма навчання:</p>
                            <div class="teach-form">
                                <button class="teach-btn teach-offline btn">Офлайн</button>
                                <button class="teach-btn teach-online btn">Онлайн</button>
                            </div>
                        </div>
                        <div class="additionalInfo text-center">
                            <div class="wrapper">
                                <div id="offlineInfo" style="display: block;">
                                    <label for="classroomNumber">Номер аудиторії:</label>
                                    <input type="text" id="classroomNumber" class="input" name="classroomNumber">
                                </div>
                                <div id="onlineInfo" style="display: none;">
                                    <label for="email">Електронна пошта:</label>
                                    <input type="email" class="input" id="email" name="email" value="${d_emails.split(";")[0]}">
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="d-flex justify-content-between">
                            <div style="text-align: start;">
                            <button class="default-btn remove-move" style=" padding: 8px;"><i class="fas fa-trash"></i> </button>
                            </div>
                            <div style="text-align: end;">
                            <button class="default-btn lock-cell" style=" padding: 8px;"><i class="fas fa-lock"></i><i class="fas fa-unlock"></i></button>
                            </div>
                        </div>
                </div>`);
                if(hasCategorical) {
                    elem.attr("categorical", "1");
                }
                rootelem.append(elem);
                var defaultType = getDefaultType();
                rootelem.find('.type-lesson').find("select[name='lessonType']").find("option[value='"+defaultType+"']").prop("selected", true)
                var defaultForm = getDefaultForm();

                // Зміна класів та видимості в залежності від значення за замовчуванням
                if (defaultForm === "offline") {
                    rootelem.find('.teach-form .teach-offline').addClass('active');
                    rootelem.find('#offlineInfo').show();
                    rootelem.find('#onlineInfo').hide();
                } else {
                    rootelem.find('.teach-form .teach-online').addClass('active');
                    rootelem.find('#offlineInfo').hide();
                    rootelem.find('#onlineInfo').show();
                }
            }
        }
    }

    function getCountColumn(column) {
        var tds = column.parent().find("td");

        for (let index = 0; index < tds.length; index++) {
            var currentTd = $(tds[index]);

            if (currentTd.is(column)) {
                return index;
            }
        }
    }


});