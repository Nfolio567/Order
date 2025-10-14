export class UpdateProducts {
  drawWindow(children: HTMLCollection | undefined) {
    const window = document.getElementById("add-delete-update-window");
    window?.insertAdjacentHTML('beforeend', 
      `
        <div id="update-products" class="add-window products">
          <h1>商品内容更新</h1>
        </div>
      `);
    const windowChild = document.getElementById("update-products")
    if(children) Array.from(children).forEach(async (element) => {
      if(element.className == "ud-container") return;
      if(element.className == "id-name-container") {
        windowChild?.insertAdjacentHTML('beforeend', 
          `<label>
            <input type="checkbox" name="update-selector" id="updated-name">
            ${element.children[1].innerHTML}&nbsp;→&nbsp;
            <span>そのまま</span> 
            <input class="hidden" type="text">
          </label>
          `);
      } else if(element.id.substring(0, 7) === "options" && element.innerHTML.length != 0) {
        windowChild?.insertAdjacentHTML('beforeend', '<label><input type="checkbox" id="is-update-options">オプションを変更する</label>');
        try {
          const res = await fetch('/api/options');
          const datas = await res.json();
          let isOriginallySelected = false;
          datas.forEach((data: {name: string}) => {
            Array.from(element.children).forEach((option) => {
              if(data.name === option.innerHTML.split("&")[0]) {
                isOriginallySelected = true;
                windowChild?.insertAdjacentHTML('beforeend', 
                  `<label>
                    <input type="checkbox" name="option-selector" id="updated-options" checked>
                    ${option.innerHTML.split("&")[0]}
                  </label>
                `);
              }
            });

            if(!isOriginallySelected) {
              windowChild?.insertAdjacentHTML('beforeend', 
                `<label>
                  <input type="checkbox" name="option-selector" id="updated-options">
                  ${data.name}
                </label>
              `);
            }
            isOriginallySelected = false;
          });
        } catch(e) {
          console.error(e);
        }
      } else if(element.className == "product-price") {
        windowChild?.insertAdjacentHTML('beforeend', 
          `<label>
            <input type="checkbox" name="update-selector" id="updated-price">
            ${element.innerHTML}&nbsp;→&nbsp;
            <span>そのまま</span>
            <input class="hidden" type="text">
          </label>
          `);
      }
    });

    const checkBoxes = document.getElementsByName("update-selector") as NodeListOf<HTMLInputElement>;
    Array.from(checkBoxes).forEach((checkBox) => {
      checkBox.addEventListener('change', () => {
        if(checkBox.parentElement && checkBox.checked) {
          const sonomamaSpan = checkBox.parentElement.children[1] as HTMLElement;
          sonomamaSpan.style.display = "none";
          if(checkBox.parentElement.children[2]) checkBox.parentElement.children[2].className = "edit-window-input";
        }
        if(checkBox.parentElement && !checkBox.checked) {
          const sonomamaSpan = checkBox.parentElement.children[1] as HTMLElement;
          sonomamaSpan.style.display = "inline-block";
          if(checkBox.parentElement.children[2]) checkBox.parentElement.children[2].className = "hidden";
        }
      });
    });

    if(window) window.className = "add-background";
  }
}