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
      if (addhCheck) addhCheck.className = "hidden";
    }


window.addEventListener("DOMContentLoaded", async () => { // 初回ロードで商品一覧取得しーの表示
  try{
    const res = await fetch("/api/products");
    const datas = await res.json();
    const productsElement = document.getElementById("products");
    if (productsElement) {
      datas.forEach((data: { id: any; name: any; options: any; price: any }) => {
        productsElement.insertAdjacentHTML("beforeend",  
          `<div class="product">
            <div style="display: flex; align-items: center;">
              <h1 class="id">${data.id}: </h1>
              <h2 class="product-name">${data.name}</h2>
            </div>
            <h2 class="product-price">${moneyFormatter.format(data.price)}</h2>
            <h2 class="product-options">${data.options}</h2>
          </div>`
        );
      });
    }
  } catch (e) {
    console.error(e);
  }
});


const openAddSelector = document.getElementById("open-add-selector");
let selectorTogle = false;
openAddSelector?.addEventListener('click', () => {
  selectorTogle = !selectorTogle;
  const addSelecter = document.getElementById("add-select-diarog");
  if (addSelecter) {
    if (selectorTogle) addSelecter.className = "add-select-diarog"; // セレクター表示
    else addSelecter.className = "hidden";
  }
})


const addProducts = new AddProducts();

const addButtonProduct = document.getElementById("add-button-product");
addButtonProduct?.addEventListener('click', addProducts.drawAddWindow);

const closeAddProducts = document.getElementById("close-add-products");
closeAddProducts?.addEventListener("click", addProducts.closeAddWindow);

const addProductsCheckBotton = document.getElementById("add-products-check-button");
addProductsCheckBotton?.addEventListener("click", addProducts.checkAdd);


const addOptions = new AddOptions();

const addButtonOptions = document.getElementById("add-button-options");
addButtonOptions?.addEventListener('click', addOptions.drawAddWindow);

const closeAddOptions = document.getElementById("close-add-options");
closeAddOptions?.addEventListener('click', addOptions.closeAddWindow);

const addOptionsCheckButton = document.getElementById("add-options-check-button");
addOptionsCheckButton?.addEventListener('click', addOptions.checkAdd);
