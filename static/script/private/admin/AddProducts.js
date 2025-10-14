var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { closeAddSelector, fetch2Server, closeAddCheckWindow, moneyFormatter } from "./admin";
export class AddProducts {
    drawAddWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            closeAddSelector();
            const res = yield fetch('/api/options');
            const datas = yield res.json();
            const add = document.getElementById("add-delete-update-window");
            console.log(add);
            add === null || add === void 0 ? void 0 : add.insertAdjacentHTML('beforeend', `
        <div id="add-products" class="add-window products">
          <h1>商品追加</h1>
          <div>
            <label style="font-size: 50px; font-weight: bold;">NAME:&nbsp;
              <input style="width: 65%; font-size: 30px;" type="text" name="product-name">
            </label>
          </div>
          <div>
            <label style="font-size: 50px; font-weight: bold;">PRICE:&nbsp;¥
              <input style="width: 60%; font-size: 30px;" type="number" name="product-price" min="0" max="10000">
            </label>
          </div>
          <div id="options" class="options"></div>
          <button id="add-products-check-button">確認</button>
        </div>
    `);
            const options = document.getElementById("options");
            const closeButton = document.getElementById("close");
            console.log(closeButton);
            closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.add("products");
            closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', this.closeAddWindow);
            console.log(closeButton);
            const addProductsCheckBotton = document.getElementById("add-products-check-button");
            addProductsCheckBotton === null || addProductsCheckBotton === void 0 ? void 0 : addProductsCheckBotton.addEventListener("click", this.checkAdd);
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
        const addProducts = document.getElementById("add-delete-update-window");
        if (addProducts)
            addProducts.className = "hidden";
        const closeButton = document.getElementById("close");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.classList.remove("products");
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.removeEventListener('click', this.closeAddWindow);
        const container = document.getElementById("add-products");
        container === null || container === void 0 ? void 0 : container.remove();
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
                        const products = document.getElementsByClassName("product");
                        let count;
                        if (products)
                            count = products.length;
                        else
                            count = 0;
                        productsElement.insertAdjacentHTML("beforeend", `<div class="product">
                <div class="ud-container">
                  <button class="delete-product">
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12V17" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 12V17" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 7H20" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="update-product">
                    <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="id-name-container">
                  <h1 class="id">${newProduct.id}: </h1>
                  <h2 class="product-name">${newProduct.name}</h2>
                </div>
                <h2 class="product-price">${moneyFormatter.format(newProduct.price)}</h2>
                <div id="options${count}"></div>
              </div>`);
                        if (newProduct.options.length != 0) {
                            const options = document.getElementById(`options${count}`);
                            newProduct.options.forEach((option) => {
                                if (options)
                                    options.insertAdjacentHTML('beforeend', `<h2 class="product-options">${option.name}&nbsp;+${moneyFormatter.format(Number(option.price))}</h2>`);
                            });
                        }
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
