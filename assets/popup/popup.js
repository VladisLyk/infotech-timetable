class Popup {
    text;
    elem;
    popup;

    static alert(elem, text, time) {
        var popup = $("<div class='popup_message alert' style='display: none; position: absolute; top: " + (elem.position().top) +
        "px;'>" +
        text +
        "</div>").appendTo("body");
        popup.fadeIn(100);
        const popupWidth = elem.width();
        const popupHeight = elem.height();
        const popupLeft = elem.offset().left + (popupWidth - popup.width()) / 2;
        const popupTop = elem.offset().top - (popupHeight);
        popup.attr("style", popup.attr("style") + " display: block; left: " + (elem.position().left)  + "px; top: " + popupTop +
        "px; left: " + popupLeft + "px;");
        setTimeout(() => {
            popup.fadeOut(100);
            setTimeout(() => {
                popup.remove();
            }, 200);
        }, time*1000);

    }
    static popups = [];

    static checkAdded(elem) {
        for (let index = 0; index < this.popups.length; index++) {
            const popup = this.popups[index];
            if (popup.elem.is(elem)) {
                return popup;
            }
        }
        return null;
    }

    static getClass(elem) {
        for (let index = 0; index < this.popups.length; index++) {
            const popup = this.popups[index];
            if (popup.elem.is(elem)) {
                return popup.objP;
            }
        }
        return null;
    }

    static get(elem) {
        const popup = Popup.checkAdded(elem);
        return popup ? popup.popup : null;
    }

    constructor(text, elem) {
        var existingPopup = Popup.checkAdded(elem);
        if (existingPopup) {
            this.text = existingPopup.text;
            this.elem = existingPopup.elem;
            this.popup = existingPopup.popup;
            this.display();
        } else {
            this.text = text;
            this.elem = elem;

            this.#create();
            this.display();

            Popup.popups.push({ elem: this.elem, popup: this.popup, text: this.text, objP: this });
        }
    }
    changeText(text) {
        this.text = text;
        this.popup.html(text);
    }
    display() {
        this.popup.fadeIn(200);
        const popupWidth = this.elem.width();
        const popupHeight = this.elem.height();
        const popupLeft = this.elem.offset().left + (popupWidth - this.popup.width()) / 2;
        const popupTop = this.elem.offset().top - (popupHeight);
        this.popup.attr("style", this.popup.attr("style") + " display: block; left: " + (this.elem.position().left)  + "px; top: " + popupTop +
        "px; left: " + popupLeft + "px;")
    }

    fadeO(duration = 300, delay = 0) {
            this.popup.delay(delay).animate({
                opacity: 0
            }, duration, function() {
                this.popup.css("display", "none");
            });
    }

    hide() {
        
    }

    #create() {
        this.popup = $("<div class='popup_message' style='display: none; position: absolute; top: " + (this.elem.position().top) +
            "px;'>" +
            this.text +
            "</div>").appendTo("body");
    }

}

$(".popup-window").hover(
    
    function () {
        new Popup($(this).attr("popup-text"), $(this)).display();
    },
    function () {
        Popup.get($(this)).fadeOut(150);
    }
);
