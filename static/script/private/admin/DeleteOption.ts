class DeleteOption {
  drawDeleteWindow() {
    closeAddSelector();
    const deleteWindow = document.getElementById("add-delete-update-window");
    deleteWindow?.insertAdjacentHTML('beforeend', 
      `
        <div id="delete-options" class="add-window options">
          <h1>オプション削除</h1>
          <div id="select-delete-options" class="select-delete-options"></div>
          <button id="delete-options-check-button">確認</button>
        </div>
      `);
    getOptions();
    if(deleteWindow) deleteWindow.className = "add-background";

    const closeButton = document.getElementById("close");
    closeButton?.classList.add("options");
    closeButton?.addEventListener('click', this.closeDeleteWindow);

    const checkDeleteOptions = document.getElementById("delete-options-check-button");
    checkDeleteOptions?.addEventListener('click', deleteOption.check);

    async function getOptions() {
      try {
        const res = await fetch('/api/options');
        const datas = await res.json();
        const selector = document.getElementById("select-delete-options");
        if(selector) selector.innerHTML = "";
        datas.forEach((data: {id: any, name: any, price: any }) => {
          selector?.insertAdjacentHTML('beforeend', 
            `
              <label>
                <input type="checkbox" name="deleted-options" value="${data.name}">
                ${data.name}&nbsp;+${moneyFormatter.format(data.price)}
              </label>
            `);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  closeDeleteWindow() {
    const deleteWindow = document.getElementById("delete-options");
    if(deleteWindow) deleteWindow.className = "hidden";

    const closeButton = document.getElementById("close");
    closeButton?.classList.remove("options");
    closeButton?.removeEventListener('click', this.closeDeleteWindow);

    const container = document.getElementById("delete-options");
    container?.remove();
  }

  check() {
    const options = document.getElementsByName("deleted-options") as NodeListOf<HTMLInputElement>;
    let checkedOptions = [] as Array<HTMLInputElement>;
    options.forEach((option) => {
      if(option.checked) checkedOptions.push(option);
    });
    console.log(checkedOptions);
    
    const deleteWindow = document.getElementById("delete-options");
    if(deleteWindow) deleteWindow.className = "hidden";

    const checkWindow = document.getElementById("check");
    if(checkWindow) checkWindow.className = "add-background";
    const container = document.getElementById("check-container");
    if(container) container.innerHTML = "<h1>削除するよ？</h1>";
    checkedOptions.forEach((option) => {
      container?.insertAdjacentHTML('beforeend', 
        `
          <p>${option.value}</p>
        `);
    });
    container?.insertAdjacentHTML('beforeend', 
    `
      <button id="delete-option-correction">修正</button>
      <button id="delete-button-option">削除</button>
    `);
    
    const deleteCorrectionButton = document.getElementById("delete-option-correction");
    deleteCorrectionButton?.addEventListener('click', correction);

    const deleteButton = document.getElementById("delete-button-option");
    deleteButton?.addEventListener('click', async () => {
      const data = await fetch2Server({"name": checkedOptions}, '/api/options/delete', 'POST');
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
        const checkWindow = document.getElementById("check");
        if(checkWindow) checkWindow.className = "hidden";
      }
    });

    function correction() {
      const deleteWindow = document.getElementById("delete-options");
      if(deleteWindow) deleteWindow.className = "add-background";
      const checkWindow = document.getElementById("check");
      if(checkWindow) checkWindow.className = "hidden";
    }
  }
}
