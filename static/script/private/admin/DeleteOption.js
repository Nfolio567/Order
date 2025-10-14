var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { closeAddSelector, fetch2Server, moneyFormatter } from "./admin";
export class DeleteOption {
    drawDeleteWindow() {
        closeAddSelector();
        const deleteWindow = document.getElementById("add-delete-update-window");
        deleteWindow === null || deleteWindow === void 0 ? void 0 : deleteWindow.insertAdjacentHTML('beforeend', `
        <div id="delete-options" class="add-window options">
          <h1>オプション削除</h1>
          <div id="select-delete-options" class="select-delete-options"></div>
          <button id="delete-options-check-button">確認</button>
        </div>
      `);
        getOptions();
        if (deleteWindow)
            deleteWindow.className = "add-background";
        const closeButton = document.getElementById("close");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.add("options");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', this.closeDeleteWindow);
        const checkDeleteOptions = document.getElementById("delete-options-check-button");
        checkDeleteOptions === null || checkDeleteOptions === void 0 ? void 0 : checkDeleteOptions.addEventListener('click', this.check);
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
            });
        }
    }
    closeDeleteWindow() {
        const deleteWindow = document.getElementById("delete-options");
        if (deleteWindow)
            deleteWindow.className = "hidden";
        const closeButton = document.getElementById("close");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.remove("options");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.removeEventListener('click', this.closeDeleteWindow);
        const container = document.getElementById("delete-options");
        container === null || container === void 0 ? void 0 : container.remove();
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
        deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch2Server({ "name": checkedOptions }, '/api/options/delete', 'POST');
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
                const checkWindow = document.getElementById("check");
                if (checkWindow)
                    checkWindow.className = "hidden";
            }
        }));
        function correction() {
            const deleteWindow = document.getElementById("delete-options");
            if (deleteWindow)
                deleteWindow.className = "add-background";
            const checkWindow = document.getElementById("check");
            if (checkWindow)
                checkWindow.className = "hidden";
        }
    }
}
