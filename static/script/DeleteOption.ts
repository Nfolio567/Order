class DeleteOption {
  drawDeleteWindow() {
    closeAddSelector();
    const deleteWindow = document.getElementById("delete-options");
    getOptions();
    if(deleteWindow) deleteWindow.className = "add-background";

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
      
      function closeAddSelector() {
        const addSelecter = document.getElementById("add-select-diarog");
        if (addSelecter) {
          selectorTogle = false;
          addSelecter.className = "hidden"; // セレクター非表示
        }
      }
    }
  }

  closeDeleteWindow() {
    const deleteWindow = document.getElementById("delete-options");
    if(deleteWindow) deleteWindow.className = "hidden";
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
    deleteButton?.addEventListener('click', fetch2Server);

    function correction() {
      const deleteWindow = document.getElementById("delete-options");
      if(deleteWindow) deleteWindow.className = "add-background";
      const checkWindow = document.getElementById("check");
      if(checkWindow) checkWindow.className = "hidden";
    }
    
    async function fetch2Server() {
      const csrfToken = document.querySelector("input[name=csrf_token]") as HTMLInputElement;
      try {
        const res = await fetch('/api/option/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken.value
          },
          body: JSON.stringify({
            "name": checkedOptions
          })
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
