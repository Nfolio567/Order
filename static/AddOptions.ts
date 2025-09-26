class AddOptions {
  drawAddWindow() { // オプション追加ウィンドウ描画
    closeAddSelector();
    const addOptions = document.getElementById("add-options");
    if(addOptions) addOptions.className = "add-background";
  }

  closeAddWindow() { // 閉じる
    const addOptions = document.getElementById("add-options");
    if(addOptions) addOptions.className = "hidden";
  }

  checkAdd() {
    const name = document.querySelector("input[name=option-name]") as HTMLInputElement;
    const price = document.querySelector("input[name=option-price]") as HTMLInputElement;

    if (name.value != "" && price.value != ""){
      this.closeAddWindow;
      const addCheck = document.getElementById("add-check");
      if (addCheck) addCheck.className = "add-background";
      const checkContainer = document.getElementById("check-container");
      if (checkContainer) checkContainer.innerHTML = 
      `
        <h1>この内容で大丈夫？</h1>
        <p>NAME:&nbsp;${name.value}</p>
        <p>PRICE:&nbsp;${price.value}</p>
        <button id="add-options-submit">確定</button>
        <button id="add-options-cancel">修正</button>
      `;

      const submit = document.getElementById("add-options-submit");
      const cancel = document.getElementById("add-options-cancel");
      submit?.addEventListener('click', fetch2Server);
      cancel?.addEventListener('click', correction);
    }

    function correction() { // 修正された時のアクション
      const add = document.getElementById("add-options");
      if (add) add.className = "add-background";
      closeAddCheckWindow();
    }

    async function fetch2Server() { // サーバーに送信
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      try {
        const res = await fetch('/api/options', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken.value
          },
          body: JSON.stringify({
            "name": name.value,
            "price": price.value
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
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
