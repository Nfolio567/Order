var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { moneyFormatter } from "./script.js";
const orders = []; // サーバーに送る注文内容
const removeOrderButton = document.getElementsByClassName("remove-order");
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const productsContainer = document.getElementById("products");
    try {
        // 注文ableの商品描画
        const res = yield fetch('/api/products');
        const datas = yield res.json();
        let count = 0;
        datas.forEach((data) => {
            productsContainer === null || productsContainer === void 0 ? void 0 : productsContainer.insertAdjacentHTML('beforeend', `<div class="products-container" id="products${count}"></div>`);
            const container = document.getElementById(`products${count}`);
            container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', `
          <div class="name">
            <label class="products-name"><input type="hidden" name="ordered-products" value="${data.id}:${data.name}">&nbsp;&nbsp;${data.name}<br><strong>${moneyFormatter.format(Number(data.price))}</strong></label>
            <div class="products-options"></div>
          </div>
          <button class="add-order">追加</button>
        `);
            data.options.forEach((option) => {
                const thisOptions = container === null || container === void 0 ? void 0 : container.children[0].children[1];
                thisOptions === null || thisOptions === void 0 ? void 0 : thisOptions.insertAdjacentHTML('beforeend', `
            <label><input type="checkbox" name="this-options${count}" value="${option.name}">${option.name}&nbsp;+${moneyFormatter.format(Number(option.price))}</label>
          `);
            });
            count++;
        });
        // 追加ボタンのアクション
        let orderListCount = 0;
        const addOrderButton = document.getElementsByClassName("add-order");
        Array.from(addOrderButton).forEach((button) => {
            button.addEventListener('click', () => {
                let isSame = false;
                const container = button.parentElement;
                const productHiddenInput = container === null || container === void 0 ? void 0 : container.children[0].children[0].children[0];
                const productIdName = productHiddenInput.value;
                const options = container === null || container === void 0 ? void 0 : container.children[0].children[1].children;
                const orderOptions = [];
                if (options)
                    Array.from(options).forEach((option) => {
                        const optionCheckbox = option.children[0];
                        if (optionCheckbox.checked) {
                            orderOptions.push(optionCheckbox.value);
                        }
                    });
                console.log(orders);
                for (let i = 0; i < orders.length; i++) {
                    if (productIdName.split(":")[0] == orders[i].id && orderOptions.join("") == orders[i].options.join("")) {
                        console.log("test1");
                        orders[i].quantity++;
                        const quantity = document.getElementById(`quantity${i}`);
                        if (quantity)
                            quantity.innerHTML = `×${orders[i].quantity}`;
                        isSame = true;
                    }
                }
                if (!isSame) {
                    console.log("test2");
                    orders.push({ "id": productIdName.split(":")[0], "options": orderOptions, "quantity": 1 });
                    const willOrderList = document.getElementById("will-order-list");
                    willOrderList === null || willOrderList === void 0 ? void 0 : willOrderList.insertAdjacentHTML('beforeend', `
            <div class="order-product-container">
              <div>
                <input type="hidden" value="${orderListCount}"></input>
                <p class="order-list-name">${productIdName.split(":")[1]}</p>
                <p id="quantity${orderListCount}">×${orders[orders.length - 1].quantity}</p>
                <div id="order${orderListCount}"></div>
              </div>
              <button class="remove-order">削除</button>
            </div>
          `);
                    const optionsContainer = document.getElementById(`order${orderListCount}`);
                    orderOptions.forEach((option) => {
                        optionsContainer === null || optionsContainer === void 0 ? void 0 : optionsContainer.insertAdjacentHTML('beforeend', `
              <li>${option}</li>
            `);
                    });
                    orderListCount++;
                    // 削除ボタンのアクション
                    Array.from(removeOrderButton).forEach((button) => {
                        button.onclick = null;
                        button.onclick = () => {
                            const minOrderContainer = button.parentElement;
                            const orderContainer = minOrderContainer === null || minOrderContainer === void 0 ? void 0 : minOrderContainer.parentElement;
                            const minOrderId = minOrderContainer === null || minOrderContainer === void 0 ? void 0 : minOrderContainer.children[0].children[0];
                            orders.splice(Number(minOrderId.value), 1);
                            minOrderContainer === null || minOrderContainer === void 0 ? void 0 : minOrderContainer.remove();
                            const minOrders = orderContainer === null || orderContainer === void 0 ? void 0 : orderContainer.children;
                            let valueCount = 0;
                            if (minOrders)
                                Array.from(minOrders).forEach((minOrder) => {
                                    const value = minOrder.children[0].children[0];
                                    value.value = String(valueCount);
                                    valueCount++;
                                });
                            orderListCount = valueCount;
                        };
                    });
                }
                isSame = false;
            });
        });
    }
    catch (e) {
        console.error(e);
    }
}));
const orderSubmit = document.getElementById("order-submit");
orderSubmit === null || orderSubmit === void 0 ? void 0 : orderSubmit.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.querySelector("input[name=csrf_token]");
    try {
        const res = yield fetch('/order-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken.value
            },
            body: JSON.stringify(orders)
        });
        console.log(orders);
    }
    catch (e) {
        console.error(e);
    }
}));
const socket = io.connect("http://localhost:6743");
