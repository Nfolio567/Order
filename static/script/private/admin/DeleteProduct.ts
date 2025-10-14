import { fetch2Server } from "./admin";

export class DeleteProduct {
  drawCheckWindow(children: HTMLCollection | undefined) {
    console.log(children);
    const checkContent = document.getElementById("check-container");
    let id: string;
    if(checkContent) checkContent.innerHTML = 
    `
      <button id="close-delete-product" class="close delete-product">✖️</button>
      <h1>削除する？</h1>
    `;
    closeDeleteWindow();
    if(children) Array.from(children).forEach((element) => {
      if(checkContent) {
        if(element.className === "ud-container") return;
        if(element.className === "id-name-container") {
          id = element.children[0].innerHTML.substring(0, 4);
          checkContent.insertAdjacentHTML("beforeend",  
          `
            <p>${id}</p>
            <p>${element.children[1].innerHTML}</p>
          `); //NOTE: 0: id, 1: name
        } else if(element.id.substring(0, 7) === "options") {
          Array.from(element.children).forEach((option) => {
            checkContent.insertAdjacentHTML('beforeend', 
              `
                <p>${option.innerHTML}</p>
              `);
          });
        } else {
          checkContent.insertAdjacentHTML("beforeend", 
          `
            <p>${element.innerHTML}</p>
          `);
        }
      }
    });
    if(checkContent) checkContent.insertAdjacentHTML("beforeend", '<button id="submit-delete-product">確定</button>');
    const checkWindow = document.getElementById("check");
    if(checkWindow) checkWindow.className = "add-background";

    const submitDeleteProduct = document.getElementById("submit-delete-product");
    submitDeleteProduct?.addEventListener('click', async () => {
      console.log("test1212");
      const data = await fetch2Server({"id": id}, '/api/products/delete', 'POST');

      if(data.status) {
        const status = data.status;
        const flash = document.getElementById("flash");

        if(flash) {
            flash.classList.remove("flash-hiden");
            flash.classList.add("flash");
            flash.innerHTML = status;
            setTimeout(async () => {
              flash.classList.remove("flash")
              flash.classList.add("flash-hiden");
              flash.innerHTML = "";
            }, 2000);
        }
        closeWindow();
      }
    });

    function closeDeleteWindow() {
      const closeButton = document.getElementById("close-delete-product");
      console.log(closeButton);
      closeButton?.addEventListener('click', closeWindow);
    }

    function closeWindow() {
      const deleteWindow = document.getElementById("check");
      console.log(deleteWindow);
      if(deleteWindow) deleteWindow.className = "hidden";
    }
  }
}
