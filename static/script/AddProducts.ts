class AddProducts {
  async drawAddWindow() { // 商品追加ウィンドウ描画
    closeAddSelector();
    const res = await fetch('/api/options');
    const datas = await res.json();
    const options = document.getElementById("options");
    const add = document.getElementById("add-products");
    if (options && add) {
      options.innerHTML = "";
      add.className = "add-background";
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
  }

  closeAddWindow() { // 商品追加ウィンドウ閉じる
    const addProducts = document.getElementById("add-products");
    if (addProducts) addProducts.className = "hidden";
  }

  checkAdd() { // 最終確認
    const name = document.querySelector("input[name=product-name]") as HTMLInputElement;
    const price = document.querySelector("input[name=product-price") as HTMLInputElement;
    if (name.value != "" && price.value != ""){
      this.closeAddWindow;
      const addCheck = document.getElementById("check");
      if (addCheck) addCheck.className = "add-background";
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
      <button id="add-products-submit">確定</button>
      <button id="add-products-cancel">修正</button>
      `;

      const cancel = document.getElementById("add-products-cancel");
      cancel?.addEventListener('click', correction);

      const addSubmit = document.getElementById("add-products-submit");
      addSubmit?.addEventListener("click", () => fetch2Server(checkedOptions));
    }


    function correction() { // 修正された時のアクション
      const add = document.getElementById("add-products");
      if (add) add.className = "add-background";
      closeAddCheckWindow();
    }

    async function fetch2Server(checkedOptions: Array<String>) { // サーバーに送信
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      try {
          const res = await fetch('/api/products/create', {
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
            productsElement.insertAdjacentHTML("beforeend", 
              `<div class="product">
                <div style="display: flex; align-items: center;">
                  <h1 class="id">${newProduct.id}: </h1>
                  <h2 class="product-name">${newProduct.name}</h2>
                </div>
                <h2 class="product-price">${moneyFormatter.format(newProduct.price)}</h2>
                <h2 class="product-options">${newProduct.options}</h2>
              </div>`
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
