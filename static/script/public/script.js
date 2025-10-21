var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const moneyFormatter = Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
});
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const headerBack = document.getElementById("headerBack");
    headerBack === null || headerBack === void 0 ? void 0 : headerBack.classList.add(location.pathname.substring(1));
    const productsContainer = document.getElementById("products");
    try {
        const res = yield fetch('/api/products');
        const datas = yield res.json();
        let count = 0;
        datas.forEach((data) => {
            productsContainer === null || productsContainer === void 0 ? void 0 : productsContainer.insertAdjacentHTML('beforeend', `<div class="products-container" id="products${count}"></div>`);
            const container = document.getElementById(`products${count}`);
            container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', `
          <div class="name">
            <label class="products-name"><input type="checkbox" name="ordered-products" value="${data.id}">&nbsp;&nbsp;&nbsp;&nbsp;${data.name}<br><strong>${moneyFormatter.format(Number(data.price))}</strong></label>
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
        const addOrderButton = document.getElementsByClassName("add-order");
        Array.from(addOrderButton).forEach((button) => {
            button.addEventListener('click', () => {
                var _a;
                const productId = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.children;
            });
        });
    }
    catch (e) {
        console.error(e);
    }
}));
let isVisible = false;
const adminButton = document.getElementById("admin-button");
adminButton === null || adminButton === void 0 ? void 0 : adminButton.addEventListener('click', () => {
    isVisible = !isVisible;
    const popover = document.getElementById("admin");
    if (isVisible && popover) {
        popover.className = "admin-login";
    }
    else if (popover) {
        popover.className = "hidden";
    }
});
const submitButton = document.getElementById("submit");
submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.querySelector("input[name=csrf_token]");
    const name = document.querySelector("input[name=name]");
    const password = document.querySelector("input[name=password]");
    if (csrfToken && name && password) {
        try {
            const res = yield fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken.value
                },
                body: JSON.stringify({
                    name: name.value,
                    password: password.value
                })
            });
            const data = yield res.json();
            if (data.redirect) {
                console.log(data.redirect);
                window.location.href = data.redirect;
            }
            else if (data.error) {
                console.log(data.error);
                const flash = document.getElementById("flash");
                if (flash) {
                    flash.classList.remove("flash-hiden");
                    flash.classList.add("flash");
                    flash.innerHTML = data.error;
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        flash.classList.remove("flash");
                        flash.classList.add("flash-hiden");
                        flash.innerHTML = "";
                    }), 2000);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}));
