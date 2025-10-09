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
        const addOptions = document.getElementById("add-delete-update-window");
        addOptions === null || addOptions === void 0 ? void 0 : addOptions.insertAdjacentHTML('beforeend', `
      <div id="add-options" class="add-window options">
        <h1>オプション追加</h1>
        <label style="font-size: 50px; font-weight: bold;">NAME:&nbsp;
          <input style="width: 60%; font-size: 30px;" type="text" name="option-name">
        </label>
        <label style="font-size: 50px; font-weight: bold;">PRICE:&nbsp;¥
          <input style="width: 60%; font-size: 30px;" type="number" name="option-price" min="0" max="10000">
        </label>
        <button id="add-options-check-button">確認</button>
      </div>
    `);
        const closeButton = document.getElementById("close");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.add("options");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', this.closeAddWindow);
        const addOptionsCheckButton = document.getElementById("add-options-check-button");
        addOptionsCheckButton === null || addOptionsCheckButton === void 0 ? void 0 : addOptionsCheckButton.addEventListener('click', this.checkAdd);
        if (addOptions)
            addOptions.className = "add-background";
    }
    closeAddWindow() {
        const addOptions = document.getElementById("add-delete-update-window");
        if (addOptions)
            addOptions.className = "hidden";
        const closeButton = document.getElementById("close");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.remove("options");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.removeEventListener('click', this.closeAddWindow);
        const container = document.getElementById("add-options");
        container === null || container === void 0 ? void 0 : container.remove();
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
