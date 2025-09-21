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
      console.log(data);
      console.log(data.redirect);
      if (data.redirect) {
        console.log(data.redirect);
        window.location.href = data.redirect;
      }
    } catch (e) {
      console.error(e);
    }
  }
});
