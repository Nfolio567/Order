window.addEventListener('DOMContentLoaded', () => {
  const headerBack = document.getElementById("headerBack");
  headerBack?.classList.add(location.pathname.substring(1));
});


let isVisible = false;
const adminButton = document.getElementById("admin-button");
adminButton?.addEventListener('click', () => {
  isVisible = !isVisible;
  const popover = document.getElementById("admin");
  if (isVisible && popover) {
    popover.className = "admin-login";
  } else if (popover) {
    popover.className = "hiden";
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
