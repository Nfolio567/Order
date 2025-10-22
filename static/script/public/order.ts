import { moneyFormatter } from "./script.js";

const orders = [] as {id: string, options: string[], quantity: number}[]; // サーバーに送る注文内容
const removeOrderButton = document.getElementsByClassName("remove-order") as HTMLCollectionOf<HTMLButtonElement>;

document.addEventListener('DOMContentLoaded', async () => {
  const productsContainer = document.getElementById("products");
  try {
    // 注文ableの商品描画
    const res = await fetch('/api/products');
    const datas = await res.json();
    let count = 0;
    datas.forEach((data:{id: string, name: string, price: string, options: any}) => {
      productsContainer?.insertAdjacentHTML('beforeend', `<div class="products-container" id="products${count}"></div>`);
      const container = document.getElementById(`products${count}`);
      container?.insertAdjacentHTML('beforeend', 
        `
          <div class="name">
            <label class="products-name"><input type="hidden" name="ordered-products" value="${data.id}:${data.name}">&nbsp;&nbsp;${data.name}<br><strong>${moneyFormatter.format(Number(data.price))}</strong></label>
            <div class="products-options"></div>
          </div>
          <button class="add-order">追加</button>
        `);
      data.options.forEach((option: {name: string, price: string}) => {
        const thisOptions = container?.children[0].children[1];
        thisOptions?.insertAdjacentHTML('beforeend', 
          `
            <label><input type="checkbox" name="this-options${count}" value="${option.name}">${option.name}&nbsp;+${moneyFormatter.format(Number(option.price))}</label>
          `);
      });
      count++;
    });
    
    // 追加ボタンのアクション
    let orderListCount = 0;
    const addOrderButton = document.getElementsByClassName("add-order") as HTMLCollectionOf<HTMLButtonElement>;
    Array.from(addOrderButton).forEach((button) => {
      button.addEventListener('click', () => {
        let isSame = false;
        const container = button.parentElement;
        const productHiddenInput = container?.children[0].children[0].children[0] as HTMLInputElement;
        const productIdName = productHiddenInput.value;
        const options = container?.children[0].children[1].children as HTMLAllCollection | undefined;
        const orderOptions = [] as string[];
        if (options) Array.from(options).forEach((option) => {
          const optionCheckbox = option.children[0] as HTMLInputElement;
          if(optionCheckbox.checked) {
            orderOptions.push(optionCheckbox.value);
          }
        });
        console.log(orders);
        for (let i = 0; i < orders.length;i++){
          if(productIdName.split(":")[0] == orders[i].id && orderOptions.join("") == orders[i].options.join("")) {
            console.log("test1")
            orders[i].quantity++;
            const quantity = document.getElementById(`quantity${i}`);
            if (quantity) quantity.innerHTML = `×${orders[i].quantity}`;
            isSame = true;
          }
        }
        if (!isSame) {
          console.log("test2")
          orders.push({ "id": productIdName.split(":")[0], "options": orderOptions, "quantity": 1 });
        
          const willOrderList = document.getElementById("will-order-list");
          willOrderList?.insertAdjacentHTML('beforeend',
            `
            <div class="order-product-container">
              <div>
                <input type="hidden" value="${orderListCount}"></input>
                <p class="order-list-name">${productIdName.split(":")[1]}</p>
                <p id="quantity${orderListCount}">×${orders[orders.length-1].quantity}</p>
                <div id="order${orderListCount}"></div>
              </div>
              <button class="remove-order">削除</button>
            </div>
          `);
        
          const optionsContainer = document.getElementById(`order${orderListCount}`);
          orderOptions.forEach((option) => {
            optionsContainer?.insertAdjacentHTML('beforeend',
            `
              <li>${option}</li>
            `);
          });
        
          orderListCount++;
          
          // 削除ボタンのアクション
          Array.from(removeOrderButton).forEach((button) => {
            button.onclick = null;
            button.onclick = () => {
              const minOrderContainer = button.parentElement;
              const orderContainer = minOrderContainer?.parentElement;
              const minOrderId = minOrderContainer?.children[0].children[0] as HTMLInputElement;
              orders.splice(Number(minOrderId.value), 1);
              minOrderContainer?.remove();
              
              const minOrders = orderContainer?.children;
              let valueCount = 0;
              if(minOrders) Array.from(minOrders).forEach((minOrder) => {
                const value = minOrder.children[0].children[0] as HTMLInputElement;
                value.value = String(valueCount);
                valueCount++;
              })
              orderListCount = valueCount;
            }
          });
        }
        isSame = false;
      });
    });
    
  } catch(e) {
    console.error(e);
  }
});


const orderSubmit = document.getElementById("order-submit");
orderSubmit?.addEventListener('click', async () => {
  const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
  try {
    const res = await fetch('/order-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken.value
      },
      body: JSON.stringify(orders)
    });
    console.log(orders)
  } catch(e) {
    console.error(e);
  }
});

const socket = io.connect("http://localhost:6743");

