window.addEventListener("DOMContentLoaded", async () => { // 初回ロードで商品一覧取得しーの表示
  try{
    const res = await fetch("/api/products");
    const datas = await res.json();
    console.log(datas.length);
    const productsElement = document.getElementById("products");
    if (productsElement) {
      const moneyFormatter = Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
      });
      datas.forEach((data: { id: any; name: any; options: any; price: any }) => {
        const formatedPrice = moneyFormatter.format(data.price);
        productsElement.innerHTML += 
          `<div class="product">
            <div style="display: flex; align-items: center;">
              <h1 class="id">${data.id}: </h1>
              <h2 class="product-name">${data.name}</h2>
            </div>
            <h2 class="product-price">${formatedPrice}</h2>
            <h2 class="product-options">${data.options}</h2>
          </div>`;
      });
    }
  } catch (e) {
    console.error(e);
  }
});


const addButtonProduct = document.getElementById("add-button-product");
addButtonProduct?.addEventListener('click', async () => { // 商品追加ウィンドウ描画
  console.log("aaa")
  const res = await fetch('/api/options');
  const datas = await res.json();
  const options = document.getElementById("options");
  const add = document.getElementById("add");
  if (options && add) {
    options.innerHTML = "";
    add.className = "add-products-background";
    datas.forEach((data: {id: any, name: any, price: any }) => {
      options.innerHTML +=
      `<div>
        <label style="font-size: 50px; font-weight: bold;">
          <input style="transform: scale(3) translateY(-20%); margin-right: 20px;" type="checkbox" name="product-options" value="${data.name}">
          ${data.name}:&nbsp;+¥${data.price}
        </label>
      </div>`
    });
  }
});

const closeAdd = document.getElementById("close-add");
closeAdd?.addEventListener("click", closeAddWindow);　// 商品追加ウィンドウ閉じる


const addCheckBotton = document.getElementById("add-check-button");
addCheckBotton?.addEventListener("click", () => { // 商品追加の最終確認
  const name = document.querySelector("input[name=product-name]") as HTMLInputElement;
  const price = document.querySelector("input[name=product-price") as HTMLInputElement;
  if (name.value != "" && price.value != ""){
    closeAddWindow();
    const addCheck = document.getElementById("add-check");
    if (addCheck) addCheck.className = "add-products-background";
    const checkContainer = document.getElementById("check-container");
    if (checkContainer) checkContainer.innerHTML = 
    `
      <h1>この内容で大丈夫？</h1>
      <p>NAME:&nbsp;${name.value}</p>
      <p>PRICE:&nbsp;${price.value}</p>
      <p>OPTIONS:&nbsp;</p>
      <div>
    `;
    const options = document.querySelectorAll("input[name=product-options]") as NodeListOf<HTMLInputElement>;
    let checkedOptions = [] as Array<String>;
    options.forEach((data) => {
      if (data.checked) checkedOptions.push(data.value); // チェックされたやつ取得しーの配列に格納
    });

    checkedOptions.forEach((data) => {
      if (checkContainer) checkContainer.innerHTML += `<p>${data}</p`;
    })
    if (checkContainer) checkContainer.innerHTML += 
    `
    </div>
    <button id="add-submit">確定</button>
    <button id="add-cancel">修正</button>
    `;

    const cancel = document.getElementById("add-cancel");
    cancel?.addEventListener('click', () => { // 修正ボタン押された時のやつ
      const add = document.getElementById("add");
      if (add) add.className = "add-products-background";
      closeAddCheckWindow();
    });

    const addSubmit = document.getElementById("add-submit");
    addSubmit?.addEventListener("click", async () => { // サーバーに送信
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      try {
          const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken.value
          },
          body: JSON.stringify({
            name: name.value,
            price: price.value,
            options: checkedOptions
          })
        });

        const data = await res.json();

        if (data.status) {
          const status = data.status;
          const flash = document.getElementById("flash");
          if (flash) {
            flash.classList.remove("flash-hiden");
            flash.classList.add("flash");
            flash.innerHTML = status;
            setTimeout(async () => {
              flash.classList.remove("flash")
              flash.classList.add("flash-hiden");
              flash.innerHTML = "";
            }, 2000);
          }
          closeAddCheckWindow();
          const productsElement = document.getElementById("products");
          const newProduct = data.newContent;
          if (productsElement) {
            productsElement.innerHTML += 
            `<div class="product">
              <div style="display: flex; align-items: center;">
                <h1 class="id">${newProduct.id}: </h1>
                <h2 class="product-name">${newProduct.name}</h2>
              </div>
              <h2 class="product-price">${newProduct.price}</h2>
              <h2 class="product-options">${newProduct.options}</h2>
            </div>`;
          }
        }
      } catch (e) {
        console.error(e);
      }

    });
  }
});

function closeAddCheckWindow() {
  const addhCheck = document.getElementById("add-check");
  if (addhCheck) addhCheck.className = "hidden";
}

function closeAddWindow() {
  const add = document.getElementById("add");
  if (add) add.className = "hidden";
}
