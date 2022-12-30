export default class InputItem extends HTMLElement {

    constructor() {
        super();
        let template = document.getElementById("input-item");
        console.log(template)
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    connectedCallback() {
        this.addEventListener('keydown', handleInput);
    }
}

function handleInput(e) {
    const textArea = this.shadowRoot.querySelector("span");
    const text = textArea.innerText;
    console.log(text)
    if (text.length > 50) {
        alert("Maximum number of characters is 50");
    }
    if (e.code === "Enter" && text !== "") {
        e.preventDefault();

        const ul = document.querySelector("ul");

        const span = document.createElement("span");
        span.setAttribute("slot", "text");
        span.setAttribute("contenteditable", "true");
        span.innerText = text;
        const listItem = document.createElement("list-item");


        listItem.appendChild(span);
        ul.prepend(listItem);
        textArea.innerText = "";
    }
}