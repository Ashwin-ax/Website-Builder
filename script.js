const canvas = document.getElementById("canvas");
const draggables = document.querySelectorAll(".draggable");
const formFields = document.getElementById("form-fields");
const editorForm = document.getElementById("editor-form");
let selectedElement = null;

draggables.forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("type", e.target.dataset.type);
  });
});

canvas.addEventListener("dragover", e => {
  e.preventDefault();
});

canvas.addEventListener("drop", e => {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  let element;

  switch (type) {
    case "text":
      element = document.createElement("div");
      element.innerText = "Editable Text";
      break;
    case "image":
      element = document.createElement("img");
      element.src = "https://via.placeholder.com/150";
      element.style.width = "100px";
      break;
    case "button":
      element = document.createElement("button");
      element.innerText = "Click Me";
      break;
  }

  if (element) {
    const wrapper = document.createElement("div");
    wrapper.className = "canvas-item";
    wrapper.appendChild(element);
    canvas.appendChild(wrapper);
    wrapper.addEventListener("click", () => selectElement(wrapper));
  }
});

function selectElement(wrapper) {
  selectedElement = wrapper;
  formFields.innerHTML = "";
  const child = wrapper.firstElementChild;

  if (child.tagName === "DIV" || child.tagName === "BUTTON") {
    formFields.innerHTML += `<label>Text:<input type="text" name="text" value="${child.innerText}" /></label>`;
  }
  if (child.tagName === "IMG") {
    formFields.innerHTML += `<label>Image URL:<input type="text" name="src" value="${child.src}" /></label>`;
    formFields.innerHTML += `<label>Width:<input type="number" name="width" value="${parseInt(child.style.width)}" /></label>`;
  }
  formFields.innerHTML += `<label>Font Size:<input type="number" name="fontSize" value="${parseInt(getComputedStyle(child).fontSize) || 16}" /></label>`;
  formFields.innerHTML += `<label>Color:<input type="color" name="color" value="${rgbToHex(getComputedStyle(child).color)}" /></label>`;
}

editorForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!selectedElement) return;
  const child = selectedElement.firstElementChild;
  const data = new FormData(editorForm);

  if (child.tagName === "DIV" || child.tagName === "BUTTON") {
    child.innerText = data.get("text");
  }
  if (child.tagName === "IMG") {
    child.src = data.get("src");
    child.style.width = data.get("width") + "px";
  }
  child.style.fontSize = data.get("fontSize") + "px";
  child.style.color = data.get("color");
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0'));
  return `#${result.join("")}`;
}
