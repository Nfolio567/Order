var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UpdateProducts {
    drawWindow(children) {
        const window = document.getElementById("add-delete-update-window");
        window === null || window === void 0 ? void 0 : window.insertAdjacentHTML('beforeend', `
        <div id="update-products" class="add-window products">
          <h1>商品内容更新</h1>
        </div>
      `);
        const windowChild = document.getElementById("update-products");
        if (children)
            Array.from(children).forEach((element) => __awaiter(this, void 0, void 0, function* () {
                if (element.className == "ud-container")
                    return;
                if (element.className == "id-name-container") {
                    windowChild === null || windowChild === void 0 ? void 0 : windowChild.insertAdjacentHTML('beforeend', `<label>
            <input type="checkbox" name="update-selector" id="updated-name">
            ${element.children[1].innerHTML}&nbsp;→&nbsp;
            <span>そのまま</span> 
            <input class="hidden" type="text">
          </label>
          `);
                }
                else if (element.id.substring(0, 7) === "options" && element.innerHTML.length != 0) {
                    windowChild === null || windowChild === void 0 ? void 0 : windowChild.insertAdjacentHTML('beforeend', '<label><input type="checkbox" id="is-update-options">オプションを変更する</label>');
                    try {
                        const res = yield fetch('/api/options');
                        const datas = yield res.json();
                        let isOriginallySelected = false;
                        datas.forEach((data) => {
                            Array.from(element.children).forEach((option) => {
                                if (data.name === option.innerHTML.split("&")[0]) {
                                    isOriginallySelected = true;
                                    windowChild === null || windowChild === void 0 ? void 0 : windowChild.insertAdjacentHTML('beforeend', `<label>
                    <input type="checkbox" name="option-selector" id="updated-options" checked>
                    ${option.innerHTML.split("&")[0]}
                  </label>
                `);
                                }
                            });
                            if (!isOriginallySelected) {
                                windowChild === null || windowChild === void 0 ? void 0 : windowChild.insertAdjacentHTML('beforeend', `<label>
                  <input type="checkbox" name="option-selector" id="updated-options">
                  ${data.name}
                </label>
              `);
                            }
                            isOriginallySelected = false;
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (element.className == "product-price") {
                    windowChild === null || windowChild === void 0 ? void 0 : windowChild.insertAdjacentHTML('beforeend', `<label>
            <input type="checkbox" name="update-selector" id="updated-price">
            ${element.innerHTML}&nbsp;→&nbsp;
            <span>そのまま</span>
            <input class="hidden" type="text">
          </label>
          `);
                }
            }));
        const checkBoxes = document.getElementsByName("update-selector");
        Array.from(checkBoxes).forEach((checkBox) => {
            checkBox.addEventListener('change', () => {
                if (checkBox.parentElement && checkBox.checked) {
                    const sonomamaSpan = checkBox.parentElement.children[1];
                    sonomamaSpan.style.display = "none";
                    if (checkBox.parentElement.children[2])
                        checkBox.parentElement.children[2].className = "edit-window-input";
                }
                if (checkBox.parentElement && !checkBox.checked) {
                    const sonomamaSpan = checkBox.parentElement.children[1];
                    sonomamaSpan.style.display = "inline-block";
                    if (checkBox.parentElement.children[2])
                        checkBox.parentElement.children[2].className = "hidden";
                }
            });
        });
        if (window)
            window.className = "add-background";
    }
}
