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
const moneyFormatter = Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
});
function closeAddSelector() {
    const addSelecter = document.getElementById("add-select-diarog");
    if (addSelecter) {
        selectorTogle = false;
        addSelecter.className = "hidden"; // セレクター非表示
    }
}
function closeAddCheckWindow() {
    const addhCheck = document.getElementById("add-check");
    if (addhCheck)
        addhCheck.className = "hidden";
}
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch("/api/products");
        const datas = yield res.json();
        const productsElement = document.getElementById("products");
        if (productsElement) {
            datas.forEach((data) => {
                productsElement.insertAdjacentHTML("beforeend", `<div class="product">
            <div style="display: flex; align-items: center;">
              <h1 class="id">${data.id}: </h1>
              <h2 class="product-name">${data.name}</h2>
            </div>
            <h2 class="product-price">${moneyFormatter.format(data.price)}</h2>
            <h2 class="product-options">${data.options}</h2>
          </div>`);
            });
        }
    }
    catch (e) {
        console.error(e);
    }
}));
const openAddSelector = document.getElementById("open-add-selector");
let selectorTogle = false;
openAddSelector === null || openAddSelector === void 0 ? void 0 : openAddSelector.addEventListener('click', () => {
    selectorTogle = !selectorTogle;
    const addSelecter = document.getElementById("add-select-diarog");
    if (addSelecter) {
        if (selectorTogle)
            addSelecter.className = "add-select-diarog"; // セレクター表示
        else
            addSelecter.className = "hidden";
    }
});
const addProducts = new AddProducts();
const addButtonProduct = document.getElementById("add-button-product");
addButtonProduct === null || addButtonProduct === void 0 ? void 0 : addButtonProduct.addEventListener('click', addProducts.drawAddWindow);
const closeAddProducts = document.getElementById("close-add-products");
closeAddProducts === null || closeAddProducts === void 0 ? void 0 : closeAddProducts.addEventListener("click", addProducts.closeAddWindow);
const addProductsCheckBotton = document.getElementById("add-products-check-button");
addProductsCheckBotton === null || addProductsCheckBotton === void 0 ? void 0 : addProductsCheckBotton.addEventListener("click", addProducts.checkAdd);
const addOptions = new AddOptions();
const addButtonOptions = document.getElementById("add-button-options");
addButtonOptions === null || addButtonOptions === void 0 ? void 0 : addButtonOptions.addEventListener('click', addOptions.drawAddWindow);
const closeAddOptions = document.getElementById("close-add-options");
closeAddOptions === null || closeAddOptions === void 0 ? void 0 : closeAddOptions.addEventListener('click', addOptions.closeAddWindow);
const addOptionsCheckButton = document.getElementById("add-options-check-button");
addOptionsCheckButton === null || addOptionsCheckButton === void 0 ? void 0 : addOptionsCheckButton.addEventListener('click', addOptions.checkAdd);
