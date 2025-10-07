const moneyFormatter = Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY'
});

const productsLoadedEvent = new CustomEvent('productsLoaded');

function closeAddSelector() {
  const addSelecter = document.getElementById("add-select-diarog");
  if (addSelecter) {
    selectorTogle = false;
    addSelecter.className = "hidden"; // セレクター非表示
  }
}

function closeAddCheckWindow() {
  const addhCheck = document.getElementById("check");
  if (addhCheck) addhCheck.className = "hidden";
}

async function fetch2Server(content: object, URL: string, method: string) {
  try {
    const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
    const res = await fetch(URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken.value
      },
      body: JSON.stringify(content)
    })

    return res.json();
  } catch (e) {
    console.error(e);
  }
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
            <div class="ud-container">
              <button class="delete-product">
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12V17" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 12V17" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 7H20" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="update-product">
                <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ECF4FB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="id-name-container">
              <h1 class="id">${data.id}: </h1>
              <h2 class="product-name">${data.name}</h2>
            </div>
            <h2 class="product-price">${moneyFormatter.format(data.price)}</h2>
            <h2 class="product-options">${data.options}</h2>
          </div>`
        );
      });
    }
    document.dispatchEvent(productsLoadedEvent);
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


const deleteProduct = new DeleteProduct();

const deleteButtonProduct = document.getElementsByClassName("delete-product") as HTMLCollectionOf<HTMLButtonElement>;
document.addEventListener('productsLoaded', () => {
  Array.from(deleteButtonProduct).forEach((button) => {
    button.addEventListener('click', () => deleteProduct.drawCheckWindow(button.parentElement?.parentElement?.children));
  });
});


const deleteOption = new DeleteOption();

const deleteButtonOption = document.getElementById("delete-button-options");
deleteButtonOption?.addEventListener('click', deleteOption.drawDeleteWindow);

const closeDeleteOptions = document.getElementById("close-delete-options");
closeDeleteOptions?.addEventListener('click', deleteOption.closeDeleteWindow);

const checkDeleteOptions = document.getElementById("delete-options-check-button");
checkDeleteOptions?.addEventListener('click', deleteOption.check);
