import { flash } from "./script.js";

function drawOrderItems(datas: Array<Array<{id: number, ordererId: number, item: string, options: Array<string>, quantity: number, price: number}>>) {
  const container = document.getElementById("order-list-container");
  if (container) container.innerHTML = 
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
    if (data.length == 0) return;
    console.log(data)
    container?.insertAdjacentHTML('beforeend', 
      `
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
      orderList?.insertAdjacentHTML('beforeend',
        `
          <div style="display: flex; width: 100%;">
            <p class="item">${object.item}</p>
            <ul class="options" id="options${count}:${objectCount}"></ul>
            <p class="quantity">${object.quantity}</p>
          </div>
        `);
      
      const options = document.getElementById(`options${count}:${objectCount}`);
      console.log(object.options)
      console.log(objectCount)
      object.options.forEach((option) => {
        options?.insertAdjacentHTML('beforeend',
          `
            <li>${option}</li>
          `);
      });
      objectCount++;
    });
    
    // 提供ボタン
    const provide = document.getElementById(`provide${count}`) as HTMLButtonElement;
    provide?.addEventListener('click', async () => {
      provide.disabled = true;
      provide.innerText = "⏳";
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      const ordererId = provide.parentElement?.children[0].innerHTML;
      const res = await fetch('/api/provide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.value
        },
        body: JSON.stringify({
          'id': ordererId
        })
      });
      
      const data = await res.json();
      if (data.status) flash(data.status);
    });
    
    // 削除ボタン
    const deleted = document.getElementById(`remove-order-list${count}`) as HTMLButtonElement;
    deleted?.addEventListener('click', async () => {
      deleted.disabled = true;
      deleted.innerText = "⏳";
      
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      const deletedOrdererId = Number(deleted.parentElement?.children[0].innerHTML);
      const deletedOrderItemId = [] as number[];
      datas.forEach((data) => {
        data.forEach((object) => {
          if (object.ordererId == deletedOrdererId) deletedOrderItemId.push(object.id);
        });
      });
      
      const res = await fetch('/api/deleted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.value
        },
        body: JSON.stringify({
          'id': deletedOrderItemId
        })
      });
      const data = await res.json();
      if (data.status) flash(data.status);
    });
    count++;
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/list');
  const datas = await res.json() as Array<Array<{id: number, ordererId: number, item: string, options: Array<string>, quantity: number, price: number}>>;
  console.log(datas);
  drawOrderItems(datas);
});

const socket = io.connect("https://order.nfolio.one");
//const socket = io.connect("http://127.0.0.1:6743");

socket.on('connect', () => {
  console.log("!connect socket.io!");
});

socket.on('newOrder', (datas: Array<Array<{id: number, ordererId: number, item: string, options: Array<string>, quantity: number, price: number}>>) => {
  drawOrderItems(datas);
});
