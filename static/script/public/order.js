var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { moneyFormatter, flash } from "./script.js";
let orders = []; // サーバーに送る注文内容
const removeOrderButton = document.getElementsByClassName("remove-order");
const orderSubmit = document.getElementById("order-submit");
function money2num(money) {
    return Number(money.substring(1, money.length).split(",").join(""));
}
function util(datas, productsContainer) {
    if (productsContainer)
        productsContainer.innerHTML = "";
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
        button.onclick = null;
        button.onclick = () => {
            let isSame = false;
            const container = button.parentElement;
            const productHiddenInput = container === null || container === void 0 ? void 0 : container.children[0].children[0].children[0];
            const productIdName = productHiddenInput.value;
            const stringProductPrice = container === null || container === void 0 ? void 0 : container.children[0].children[0].children[2].innerHTML;
            const stringOptionPrices = [];
            const productPrice = money2num(stringProductPrice);
            const optionPrices = [];
            let price = 0;
            const options = container === null || container === void 0 ? void 0 : container.children[0].children[1].children;
            const orderOptions = [];
            if (options)
                Array.from(options).forEach((option) => {
                    const optionCheckbox = option.children[0];
                    if (optionCheckbox.checked) {
                        orderOptions.push(optionCheckbox.value);
                        if (option.textContent)
                            stringOptionPrices.push(option.textContent.split("+")[1]);
                        optionPrices.push(money2num(stringOptionPrices[stringOptionPrices.length - 1]));
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
                    const priceContainer = document.getElementById(`price${i}`);
                    console.log(orders[i].quantity);
                    orders[i].price += orders[i].price / (orders[i].quantity - 1);
                    if (priceContainer)
                        priceContainer.innerHTML = `合計: ${moneyFormatter.format(orders[i].price)}`;
                    isSame = true;
                }
            }
            if (!isSame) {
                console.log("test2");
                const willOrderList = document.getElementById("will-order-list");
                willOrderList === null || willOrderList === void 0 ? void 0 : willOrderList.insertAdjacentHTML('beforeend', `
          <div class="order-product-container">
            <div>
              <input type="hidden" value="${orderListCount}"></input>
              <p class="order-list-name">${productIdName.split(":")[1]}</p>
              <p>単価: ${stringProductPrice}</p>
              <p id="quantity${orderListCount}">×1</p>
              <div id="order${orderListCount}"></div>
              <p id="price${orderListCount}"></p>
            </div>
            <button class="remove-order">削除</button>
          </div>
        `);
                const optionsContainer = document.getElementById(`order${orderListCount}`);
                for (let i = 0; i < orderOptions.length; i++) {
                    optionsContainer === null || optionsContainer === void 0 ? void 0 : optionsContainer.insertAdjacentHTML('beforeend', `
            <li>${orderOptions[i]}+${stringOptionPrices[i]}</li>
          `);
                }
                price = productPrice;
                optionPrices.forEach((optionPrice) => {
                    price += optionPrice;
                });
                const priceContainer = document.getElementById(`price${orderListCount}`);
                if (priceContainer)
                    priceContainer.innerHTML = `合計: ${moneyFormatter.format(price)}`;
                orders.push({ "id": productIdName.split(":")[0], "options": orderOptions, "quantity": 1, "price": price });
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
                        let allPrice = 0;
                        orders.forEach((order) => {
                            allPrice += order.price;
                            console.log(order.price);
                            console.log(allPrice);
                        });
                        if (orderSubmit)
                            orderSubmit.innerHTML = `${moneyFormatter.format(allPrice)}<br>注文内容を送信`;
                    };
                });
            }
            let allPrice = 0;
            orders.forEach((order) => {
                allPrice += order.price;
                console.log(order.price);
                console.log(allPrice);
            });
            if (orderSubmit)
                orderSubmit.innerHTML = `${moneyFormatter.format(allPrice)}<br>注文内容を送信`;
            isSame = false;
        };
    });
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const productsContainer = document.getElementById("products");
    let res;
    let datas;
    try {
        // 注文ableの商品描画
        res = yield fetch('/api/products');
        datas = yield res.json();
        util(datas, productsContainer);
    }
    catch (e) {
        console.error(e);
    }
    // 注文送信のアクション
    orderSubmit === null || orderSubmit === void 0 ? void 0 : orderSubmit.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (orders.length == 0)
            return;
        orderSubmit.disabled = true;
        orderSubmit.innerText = "送信中...";
        orderSubmit.offsetHeight;
        const orderNumSelecter = document.querySelector("select[name=order-number]");
        const orderNum = orderNumSelecter.value;
        const csrfToken = document.querySelector("input[name=csrf_token]");
        try {
            const res = yield fetch('/order-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken.value
                },
                body: JSON.stringify({
                    'Order-Number': orderNum,
                    'Orders': orders
                })
            });
            console.log(orders);
            const data = yield res.json();
            if (data.status) {
                flash(data.status);
            }
            const container = document.getElementById("will-order-list");
            orders = [];
            util(datas, productsContainer);
            if (container)
                container.innerHTML = "";
        }
        catch (e) {
            console.error(e);
        }
    }));
}));
const socket = io.connect("https://order.nfolio.one");
//const socket = io.connect("http://127.0.0.1:6743");
socket.on('canProvide', (datas) => {
    console.log(datas);
    const selecter = document.querySelector("select[name=order-number]");
    const options = selecter.children;
    const firstNum = 0;
    Array.from(options).forEach((option) => {
        const opt = option;
        opt.disabled = true;
    });
    datas.forEach((data) => {
        const is_provided_num = options[data - 1];
        is_provided_num.disabled = false;
    });
    const sortedDatas = datas.sort((a, b) => a - b);
    console.log(sortedDatas);
    const opt = options[sortedDatas[0] - 1];
    opt.selected = true;
    orderSubmit.disabled = false;
    orderSubmit.innerText = "注文内容を送信";
    orderSubmit.offsetHeight;
});
socket.on('connect', () => {
    console.log("!connect socket.io!");
});
