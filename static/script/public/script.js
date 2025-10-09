"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener('DOMContentLoaded', () => {
    const headerBack = document.getElementById("headerBack");
    headerBack === null || headerBack === void 0 ? void 0 : headerBack.classList.add(location.pathname.substring(1));
});
let isVisible = false;
const adminButton = document.getElementById("admin-button");
adminButton === null || adminButton === void 0 ? void 0 : adminButton.addEventListener('click', () => {
    isVisible = !isVisible;
    const popover = document.getElementById("admin");
    if (isVisible && popover) {
        popover.className = "admin-login";
    }
    else if (popover) {
        popover.className = "hidden";
    }
});
const submitButton = document.getElementById("submit");
submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.querySelector("input[name=csrf_token]");
    const name = document.querySelector("input[name=name]");
    const password = document.querySelector("input[name=password]");
    if (csrfToken && name && password) {
        try {
            const res = yield fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken.value
                },
                body: JSON.stringify({
                    name: name.value,
                    password: password.value
                })
            });
            const data = yield res.json();
            if (data.redirect) {
                console.log(data.redirect);
                window.location.href = data.redirect;
            }
            else if (data.error) {
                console.log(data.error);
                const flash = document.getElementById("flash");
                if (flash) {
                    flash.classList.remove("flash-hiden");
                    flash.classList.add("flash");
                    flash.innerHTML = data.error;
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        flash.classList.remove("flash");
                        flash.classList.add("flash-hiden");
                        flash.innerHTML = "";
                    }), 2000);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}));
