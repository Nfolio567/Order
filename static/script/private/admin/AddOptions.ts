class AddOptions {
  drawAddWindow() { // オプション追加ウィンドウ描画
    closeAddSelector();
    const addOptions = document.getElementById("add-delete-update-window");
    addOptions?.insertAdjacentHTML('beforeend', 
    `
      <div id="add-options" class="add-window options">
        <h1>オプション追加</h1>
        <label style="font-size: 50px; font-weight: bold;">NAME:&nbsp;
          <input style="width: 60%; font-size: 30px;" type="text" name="option-name">
        </label>
        <label style="font-size: 50px; font-weight: bold;">PRICE:&nbsp;¥
          <input style="width: 60%; font-size: 30px;" type="number" name="option-price" min="0" max="10000">
        </label>
        <button id="add-options-check-button">確認</button>
      </div>
    `);

    const closeButton = document.getElementById("close");
    closeButton?.classList.add("options");
    closeButton?.addEventListener('click', this.closeAddWindow);

    const addOptionsCheckButton = document.getElementById("add-options-check-button");
    addOptionsCheckButton?.addEventListener('click', this.checkAdd);

    if(addOptions) addOptions.className = "add-background";
  }

  closeAddWindow() { // 閉じる
    const addOptions = document.getElementById("add-delete-update-window");
    if(addOptions) addOptions.className = "hidden";

    const closeButton = document.getElementById("close");
    closeButton?.classList.remove("options");
    closeButton?.removeEventListener('click', this.closeAddWindow);

    const container = document.getElementById("add-options");
    container?.remove();
  }

  checkAdd() {
    const name = document.querySelector("input[name=option-name]") as HTMLInputElement;
    const price = document.querySelector("input[name=option-price]") as HTMLInputElement;

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
        <button id="add-options-submit">確定</button>
        <button id="add-options-cancel">修正</button>
      `;

      const submit = document.getElementById("add-options-submit");
      const cancel = document.getElementById("add-options-cancel");
      submit?.addEventListener('click', async () => {
        const data = await fetch2Server({
            "name": name.value,
            "price": price.value
        }, '/api/options/create', 'POST');

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
      });
      cancel?.addEventListener('click', correction);
    }

    function correction() { // 修正された時のアクション
      const add = document.getElementById("add-options");
      if (add) add.className = "add-background";
      closeAddCheckWindow();
    }
  }
}
