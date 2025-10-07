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
class AddProducts {
    drawAddWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            closeAddSelector();
            const res = yield fetch('/api/options');
            const datas = yield res.json();
            const options = document.getElementById("options");
            const add = document.getElementById("add-products");
            if (options && add) {
                options.innerHTML = "";
                add.className = "add-background";
                datas.forEach((data) => {
                    options.innerHTML +=
                        `<div>
          <label style="font-size: 50px; font-weight: bold;">
            <input style="transform: scale(3) translateY(-20%); margin-right: 20px;" type="checkbox" name="product-options" value="${data.name}">
            ${data.name}:&nbsp;+¥${data.price}
          </label>
        </div>`;
                });
            }
        });
    }
    closeAddWindow() {
        const addProducts = document.getElementById("add-products");
        if (addProducts)
            addProducts.className = "hidden";
    }
    checkAdd() {
        const name = document.querySelector("input[name=product-name]");
        const price = document.querySelector("input[name=product-price");
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
        <p>OPTIONS:&nbsp;</p>
        <div>
      `;
            const options = document.querySelectorAll("input[name=product-options]");
            let checkedOptions = [];
            options.forEach((data) => {
                if (data.checked)
                    checkedOptions.push(data.value); // チェックされたやつ取得しーの配列に格納
            });
            checkedOptions.forEach((data) => {
                if (checkContainer)
                    checkContainer.innerHTML += `<p>${data}</p`;
            });
            if (checkContainer)
                checkContainer.innerHTML +=
                    `
      </div>
      <button id="add-products-submit">確定</button>
      <button id="add-products-cancel">修正</button>
      `;
            const cancel = document.getElementById("add-products-cancel");
            cancel === null || cancel === void 0 ? void 0 : cancel.addEventListener('click', correction);
            const addSubmit = document.getElementById("add-products-submit");
            addSubmit === null || addSubmit === void 0 ? void 0 : addSubmit.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const data = yield fetch2Server({
                    "name": name.value,
                    "price": price.value,
                    "options": checkedOptions
                }, '/api/products/create', 'POST');
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
                    const productsElement = document.getElementById("products");
                    const newProduct = data.newContent;
                    if (productsElement) {
                        productsElement.insertAdjacentHTML("beforeend", `<div class="product">
                <div style="display: flex; align-items: center;">
                  <h1 class="id">${newProduct.id}: </h1>
                  <h2 class="product-name">${newProduct.name}</h2>
                </div>
                <h2 class="product-price">${moneyFormatter.format(newProduct.price)}</h2>
                <h2 class="product-options">${newProduct.options}</h2>
              </div>`);
                    }
                }
            }));
        }
        function correction() {
            const add = document.getElementById("add-products");
            if (add)
                add.className = "add-background";
            closeAddCheckWindow();
        }
    }
}
