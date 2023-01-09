export default class InputItem extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById("input-item");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    connectedCallback() {
        this.addEventListener('keydown', handleInput);
    }
}

function handleInput(e) {
    const textArea = this.shadowRoot.querySelector("textarea");

    if (e.code === "Enter" && textArea.value !== "") {
        e.preventDefault();

        const span = document.createElement("span");
        span.setAttribute("slot", "text");
        span.setAttribute("contenteditable", "true");
        span.innerText = textArea.value;
        const listItem = document.createElement("list-item");
        listItem.appendChild(span);

        const ul = document.querySelector("ul");
        ul.prepend(listItem);

        //add to cache
        const curList = sessionStorage.getItem("current");
        const list = localStorage.getItem(curList) === null ? [] : JSON.parse(localStorage.getItem(curList));
        list.push(textArea.value);
        localStorage.setItem(curList, JSON.stringify(list));

        // auto shrink
        textArea.value = "";
        textArea.style.height = `1.2rem`;

    }

    // fixes empty components
    if (e.code === "Enter") {
        textArea.value = "";
    }
    // auto grow
    if (textArea.scrollHeight > textArea.clientHeight) {
        textArea.style.height = `${textArea.scrollHeight}px`;
    }

}