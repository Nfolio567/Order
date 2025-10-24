var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { flash } from "./script.js";
function drawOrderItems(datas) {
    const container = document.getElementById("order-list-container");
    if (container)
        container.innerHTML =
            `
    <div class="order-list-header">
      <p class="provide-num">番号</p>
      <p class="provide-item">商品名</p>
      <p class="provide-options">オプション</p>
      <p class="provide-quantity">数量</p>
    </div>
  `;
    let count = 0;
    datas.forEach((data) => {
        if (data.length == 0)
            return;
        console.log(data);
        container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', `
        <div style="display: flex; width: 100%;">
          <p class="orderer-id">${data[0].ordererId}</p>
          <div class="order-list" id="order-list${count}"></div>
          <button id="provide${count}" class="provide">提供</button>
          <button id="remove-order-list${count}" class="remove-order-list">削除</button>
        </div>
      `);
        // options描画
        const orderList = document.getElementById(`order-list${count}`);
        let objectCount = 0;
        data.forEach((object) => {
            orderList === null || orderList === void 0 ? void 0 : orderList.insertAdjacentHTML('beforeend', `
          <div style="display: flex; width: 100%;">
            <p class="item">${object.item}</p>
            <ul class="options" id="options${count}:${objectCount}"></ul>
            <p class="quantity">${object.quantity}</p>
          </div>
        `);
            const options = document.getElementById(`options${count}:${objectCount}`);
            console.log(object.options);
            console.log(objectCount);
            object.options.forEach((option) => {
                options === null || options === void 0 ? void 0 : options.insertAdjacentHTML('beforeend', `
            <li>${option}</li>
          `);
            });
            objectCount++;
        });
        // 提供ボタン
        const provide = document.getElementById(`provide${count}`);
        provide === null || provide === void 0 ? void 0 : provide.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            provide.disabled = true;
            provide.textContent = "⏳";
            const csrfToken = document.querySelector("input[name=csrf_token]");
            const ordererId = (_a = provide.parentElement) === null || _a === void 0 ? void 0 : _a.children[0].innerHTML;
            const res = yield fetch('/api/provide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken.value
                },
                body: JSON.stringify({
                    'id': ordererId
                })
            });
            const data = yield res.json();
            if (data.status)
                flash(data.status);
        }));
        // 削除ボタン
        const deleted = document.getElementById(`remove-order-list${count}`);
        deleted === null || deleted === void 0 ? void 0 : deleted.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            deleted.disabled = true;
            deleted.textContent = "⏳";
            const csrfToken = document.querySelector("input[name=csrf_token]");
            const deletedOrdererId = Number((_a = deleted.parentElement) === null || _a === void 0 ? void 0 : _a.children[0].innerHTML);
            const deletedOrderItemId = [];
            datas.forEach((data) => {
                data.forEach((object) => {
                    if (object.ordererId == deletedOrdererId)
                        deletedOrderItemId.push(object.id);
                });
            });
            const res = yield fetch('/api/deleted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken.value
                },
                body: JSON.stringify({
                    'id': deletedOrderItemId
                })
            });
            const data = yield res.json();
            if (data.status)
                flash(data.status);
        }));
        count++;
    });
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch('/api/list');
    const datas = yield res.json();
    console.log(datas);
    drawOrderItems(datas);
}));
const socket = io.connect("https://order.nfolio.one");
//const socket = io.connect("http://127.0.0.1:6743");
socket.on('connect', () => {
    console.log("!connect socket.io!");
});
socket.on('newOrder', (datas) => {
    drawOrderItems(datas);
});
