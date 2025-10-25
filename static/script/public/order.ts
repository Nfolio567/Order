import { data } from "../../../../../node_modules/autoprefixer/lib/autoprefixer.js";
import { moneyFormatter, flash } from "./script.js";

let orders = [] as {id: string, options: string[], quantity: number, price: number}[]; // サーバーに送る注文内容
const removeOrderButton = document.getElementsByClassName("remove-order") as HTMLCollectionOf<HTMLButtonElement>;
const orderSubmit = document.getElementById("order-submit") as HTMLButtonElement;

function money2num(money: string) {
  return Number(money.substring(1, money.length).split(",").join(""))
}

function util(datas:any, productsContainer: HTMLElement | null) {
  if (productsContainer) productsContainer.innerHTML = "";
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
    button.onclick = null;
    button.onclick = () => {
      let isSame = false;
      const container = button.parentElement;
      const productHiddenInput = container?.children[0].children[0].children[0] as HTMLInputElement;
      const productIdName = productHiddenInput.value;
      const stringProductPrice = container?.children[0].children[0].children[2].innerHTML as string;
      const stringOptionPrices = [] as string[];
      const productPrice = money2num(stringProductPrice);
      const optionPrices = [] as number[];
      let price = 0;
      const options = container?.children[0].children[1].children as HTMLAllCollection | undefined;
      const orderOptions = [] as string[];
      
      if (options) Array.from(options).forEach((option) => {
        const optionCheckbox = option.children[0] as HTMLInputElement;
        if(optionCheckbox.checked) {
          orderOptions.push(optionCheckbox.value);
          if (option.textContent) stringOptionPrices.push(option.textContent.split("+")[1]);
          optionPrices.push(money2num(stringOptionPrices[stringOptionPrices.length - 1]));
        }
      });
      console.log(orders);
      for (let i = 0; i < orders.length;i++){
        if(productIdName.split(":")[0] == orders[i].id && orderOptions.join("") == orders[i].options.join("")) {
          console.log("test1")
          orders[i].quantity++;
          const quantity = document.getElementById(`quantity${i}`);
          if (quantity) quantity.innerHTML = `×${orders[i].quantity}`;
          const priceContainer = document.getElementById(`price${i}`);
          console.log(orders[i].quantity)
          orders[i].price += orders[i].price / (orders[i].quantity-1);
          if(priceContainer)priceContainer.innerHTML = `合計: ${moneyFormatter.format(orders[i].price)}`
          isSame = true;
        }
      }
      if (!isSame) {
        console.log("test2")
        const willOrderList = document.getElementById("will-order-list");
        willOrderList?.insertAdjacentHTML('beforeend',
          `
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
        for (let i = 0; i < orderOptions.length;i++) {
          optionsContainer?.insertAdjacentHTML('beforeend',
          `
            <li>${orderOptions[i]}+${stringOptionPrices[i]}</li>
          `); 
        }
        
        price = productPrice
        optionPrices.forEach((optionPrice) => {
          price += optionPrice;
        });
        const priceContainer = document.getElementById(`price${orderListCount}`);
        if(priceContainer) priceContainer.innerHTML = `合計: ${moneyFormatter.format(price)}`
        
        orders.push({ "id": productIdName.split(":")[0], "options": orderOptions, "quantity": 1 , "price": price});
      
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
            
            let allPrice = 0;
            orders.forEach((order) => {
              allPrice += order.price;
              console.log(order.price)
              console.log(allPrice)
            });
            if (orderSubmit) orderSubmit.children[0].innerHTML = `${moneyFormatter.format(allPrice)}<br>注文内容を送信`;
          }
        });
      }
      let allPrice = 0;
      orders.forEach((order) => {
        allPrice += order.price;
        console.log(order.price)
        console.log(allPrice)
      });
      if (orderSubmit) orderSubmit.children[0].innerHTML = `${moneyFormatter.format(allPrice)}<br>注文内容を送信`;
      
      isSame = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const productsContainer = document.getElementById("products");
  let res;
  let datas: any;
  try {
    // 注文ableの商品描画
    res = await fetch('/api/products');
    datas = await res.json();
    util(datas, productsContainer);
  } catch(e) {
    console.error(e);
  }
  
  // 注文送信のアクション
  orderSubmit?.addEventListener('click', async () => {
    if (orders.length == 0) return;
    orderSubmit.disabled = true;
    orderSubmit.children[0].innerHTML = "送信中...";
    orderSubmit.offsetHeight;
    
    const orderNumSelecter = document.querySelector("select[name=order-number]") as HTMLSelectElement;
    const orderNum = orderNumSelecter.value;
    const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
    try {
      const res = await fetch('/order-submit', {
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
      console.log(orders)
      const data = await res.json();
      if(data.status) {
        flash(data.status);
        orderSubmit.disabled = false;
        orderSubmit.children[0].innerHTML = "注文内容を送信";
        orderSubmit.offsetHeight;
      }
      const container = document.getElementById("will-order-list");
      orders = []
      util(datas, productsContainer);
      if (container) container.innerHTML = "";
    } catch(e) {
      console.error(e);
    }
  });
});

const socket = io.connect("https://order.nfolio.one");
//const socket = io.connect("http://127.0.0.1:6743");

socket.on('canProvide', (datas: Array<number>) => {
  console.log(datas)
  const selecter = document.querySelector("select[name=order-number]") as HTMLSelectElement;
  const options = selecter.children;
  Array.from(options).forEach((option) => {
    const opt = option as HTMLOptionElement;
    opt.disabled = true;
  });
  datas.forEach((data) => {
    const is_provided_num = options[data-1] as HTMLOptionElement;
    is_provided_num.disabled = false;
  });
  const sortedDatas = datas.sort((a, b) => a - b);
  console.log(sortedDatas)
  const extensive = [] as number[];
  for (let i = 1; i < sortedDatas.length;i++) {
    if (sortedDatas[i] - sortedDatas[i - 1] > 1) {
      extensive.push(sortedDatas[i]);
    }
  }
  if (extensive.length == 0) extensive.push(sortedDatas[0]);
  const opt = options[extensive[extensive.length-1] - 1] as HTMLOptionElement;
  opt.selected = true;
});

socket.on('connect', () => {
  console.log("!connect socket.io!");
});
