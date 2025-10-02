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
class DeleteOption {
    drawDeleteWindow() {
        closeAddSelector();
        const deleteWindow = document.getElementById("delete-options");
        getOptions();
        if (deleteWindow)
            deleteWindow.className = "add-background";
        function getOptions() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield fetch('/api/options');
                    const datas = yield res.json();
                    const selector = document.getElementById("select-delete-options");
                    if (selector)
                        selector.innerHTML = "";
                    datas.forEach((data) => {
                        selector === null || selector === void 0 ? void 0 : selector.insertAdjacentHTML('beforeend', `
              <label>
                <input type="checkbox" name="deleted-options" value="${data.name}">
                ${data.name}&nbsp;+${moneyFormatter.format(data.price)}
              </label>
            `);
                    });
                }
                catch (e) {
                    console.error(e);
                }
                function closeAddSelector() {
                    const addSelecter = document.getElementById("add-select-diarog");
                    if (addSelecter) {
                        selectorTogle = false;
                        addSelecter.className = "hidden"; // セレクター非表示
                    }
                }
            });
        }
    }
    closeDeleteWindow() {
        const deleteWindow = document.getElementById("delete-options");
        if (deleteWindow)
            deleteWindow.className = "hidden";
    }
    check() {
        const options = document.getElementsByName("deleted-options");
        let checkedOptions = [];
        options.forEach((option) => {
            if (option.checked)
                checkedOptions.push(option);
        });
        console.log(checkedOptions);
        const deleteWindow = document.getElementById("delete-options");
        if (deleteWindow)
            deleteWindow.className = "hidden";
        const checkWindow = document.getElementById("check");
        if (checkWindow)
            checkWindow.className = "add-background";
        const container = document.getElementById("check-container");
        if (container)
            container.innerHTML = "<h1>削除するよ？</h1>";
        checkedOptions.forEach((option) => {
            container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', `
          <p>${option.value}</p>
        `);
        });
        container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', `
      <button id="delete-option-correction">修正</button>
      <button id="delete-button-option">削除</button>
    `);
        const deleteCorrectionButton = document.getElementById("delete-option-correction");
        deleteCorrectionButton === null || deleteCorrectionButton === void 0 ? void 0 : deleteCorrectionButton.addEventListener('click', correction);
        const deleteButton = document.getElementById("delete-button-option");
        deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener('click', fetch2Server);
        function correction() {
            const deleteWindow = document.getElementById("delete-options");
            if (deleteWindow)
                deleteWindow.className = "add-background";
            const checkWindow = document.getElementById("check");
            if (checkWindow)
                checkWindow.className = "hidden";
        }
        function fetch2Server() {
            return __awaiter(this, void 0, void 0, function* () {
                const csrfToken = document.querySelector("input[name=csrf_token]");
                try {
                    const res = yield fetch('/api/option/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfToken.value
                        },
                        body: JSON.stringify({
                            "name": checkedOptions
                        })
                    });
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
}
