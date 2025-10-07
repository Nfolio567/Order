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
class AddOptions {
    drawAddWindow() {
        closeAddSelector();
        const addOptions = document.getElementById("add-options");
        if (addOptions)
            addOptions.className = "add-background";
    }
    closeAddWindow() {
        const addOptions = document.getElementById("add-options");
        if (addOptions)
            addOptions.className = "hidden";
    }
    checkAdd() {
        const name = document.querySelector("input[name=option-name]");
        const price = document.querySelector("input[name=option-price]");
        if (name.value != "" && price.value != "") {
            this.closeAddWindow;
            const addCheck = document.getElementById("check");
            if (addCheck)
                addCheck.className = "add-background";
            const checkContainer = document.getElementById("check-container");
            if (checkContainer)
                checkContainer.innerHTML =
                    `
        <h1>この内容で大丈夫？</h1>
        <p>NAME:&nbsp;${name.value}</p>
        <p>PRICE:&nbsp;${price.value}</p>
        <button id="add-options-submit">確定</button>
        <button id="add-options-cancel">修正</button>
      `;
            const submit = document.getElementById("add-options-submit");
            const cancel = document.getElementById("add-options-cancel");
            submit === null || submit === void 0 ? void 0 : submit.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const data = yield fetch2Server({
                    "name": name.value,
                    "price": price.value
                }, '/api/options/create', 'POST');
                if (data.status) {
                    const status = data.status;
                    const flash = document.getElementById("flash");
                    if (flash) {
                        flash.classList.remove("flash-hiden");
                        flash.classList.add("flash");
                        flash.innerHTML = status;
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            flash.classList.remove("flash");
                            flash.classList.add("flash-hiden");
                            flash.innerHTML = "";
                        }), 2000);
                    }
                    closeAddCheckWindow();
                }
            }));
            cancel === null || cancel === void 0 ? void 0 : cancel.addEventListener('click', correction);
        }
        function correction() {
            const add = document.getElementById("add-options");
            if (add)
                add.className = "add-background";
            closeAddCheckWindow();
        }
    }
}
