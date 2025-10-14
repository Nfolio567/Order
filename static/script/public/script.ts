export const moneyFormatter = Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY'
});

window.addEventListener('DOMContentLoaded', async () => {
  const headerBack = document.getElementById("headerBack");
  headerBack?.classList.add(location.pathname.substring(1));

  const productsContaier = document.getElementById("products");
  try {
    const res = await fetch('/api/products');
    const datas = await res.json();
    let count = 0;
    datas.forEach((data:{id: string, name: string, price: string, options: any}) => {
      productsContaier?.insertAdjacentHTML('beforeend', 
        `
          <label><input type="checkbox" name="ordered-products">${data.name} </label>
          <div id="options${count}"></div>
        `);
      Array.from(data.options).forEach((option) => {
        const thisOptions = document.getElementById(`options${count}`);
        thisOptions?.insertAdjacentHTML('beforeend', 
          `
            <label><input type="checkbox" name="this-options${count}">${option}</label>
          `);
      });
      count++;
    });
  } catch(e) {
    console.error(e);
  }
});


let isVisible = false;
const adminButton = document.getElementById("admin-button");
adminButton?.addEventListener('click', () => {
  isVisible = !isVisible;
  const popover = document.getElementById("admin");
  if (isVisible && popover) {
    popover.className = "admin-login";
  } else if (popover) {
    popover.className = "hidden";
  }
});


const submitButton = document.getElementById("submit");
submitButton?.addEventListener('click', async () => {
  const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement | null;
  const name = document.querySelector("input[name=name]") as HTMLInputElement | null;
  const password = document.querySelector("input[name=password]") as HTMLInputElement | null;
  if (csrfToken && name && password) {
    try {
      const res = await fetch('/login', {
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

      const data = await res.json();
      if (data.redirect) {
        console.log(data.redirect);
        window.location.href = data.redirect;
      } else if(data.error) {
        console.log(data.error);
        const flash = document.getElementById("flash");
        if (flash) {
          flash.classList.remove("flash-hiden");
          flash.classList.add("flash");
          flash.innerHTML = data.error;
          setTimeout(async () => {
            flash.classList.remove("flash")
            flash.classList.add("flash-hiden");
            flash.innerHTML = "";
          }, 2000);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
});
