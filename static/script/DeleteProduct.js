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
class DeleteProduct {
    drawCheckWindow(children) {
        console.log(children);
        const checkContent = document.getElementById("check-container");
        let id;
        if (checkContent)
            checkContent.innerHTML =
                `
      <button id="close-delete-product" class="close delete-product">✖️</button>
      <h1>削除する？</h1>
    `;
        closeDeleteWindow();
        if (children)
            Array.from(children).forEach((element) => {
                if (checkContent) {
                    if (element.className === "ud-container")
                        return;
                    if (element.className === "id-name-container") {
                        id = element.children[0].innerHTML.substring(0, 4);
                        checkContent.insertAdjacentHTML("beforeend", `
            <p>${id}</p>
            <p>${element.children[1].innerHTML}</p>
          `); //NOTE: 0: id, 1: name
                    }
                    else {
                        checkContent.insertAdjacentHTML("beforeend", `
            <p>${element.innerHTML}</p>
          `);
                    }
                }
            });
        if (checkContent)
            checkContent.insertAdjacentHTML("beforeend", '<button id="submit-delete-product">確定</button>');
        const checkWindow = document.getElementById("check");
        if (checkWindow)
            checkWindow.className = "add-background";
        const submitDeleteProduct = document.getElementById("submit-delete-product");
        submitDeleteProduct === null || submitDeleteProduct === void 0 ? void 0 : submitDeleteProduct.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            closeWindow();
            const data = yield fetch2Server({ "id": parseInt(id) }, '/api/products/delete', 'POST');
            if (data.status) {
            }
        }));
        function closeDeleteWindow() {
            const closeButton = document.getElementById("close-delete-product");
            console.log(closeButton);
            closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', closeWindow);
        }
        function closeWindow() {
            const deleteWindow = document.getElementById("check");
            console.log(deleteWindow);
            if (deleteWindow)
                deleteWindow.className = "hidden";
        }
    }
}
