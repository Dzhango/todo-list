import * as Main from "../main.js";

const ENTER_KEY = 'Enter';

export default class InputItem extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById("input-item");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    connectedCallback() {
        attachEventListeners(this);

    }
}

function attachEventListeners(current) {
    current.addEventListener('keydown', handleInput);
}

function handleInput(e) {
    const textArea = this.shadowRoot.querySelector("textarea");

    // // fixes empty components
    // if (e.code === ENTER_KEY) {
    //     textArea.value = "";
    // }

    // HOW TO FIX DOUBLE ENTER BUG? 

    if (e.code === ENTER_KEY && isAlphaNumeric(textArea.value)) {
        e.preventDefault();

        createListComponent(textArea);
        uploadInput(textArea);

        // auto shrink
        textArea.value = "";
        textArea.style.height = `1.2rem`;

    }
    updateHeight(textArea)
}

function createListComponent(textArea) {
    const span = document.createElement("span");
    span.setAttribute("slot", "text");
    span.setAttribute("contenteditable", "true");
    span.innerText = textArea.value;
    const listItem = document.createElement("list-item");
    listItem.appendChild(span);

    const ul = document.querySelector("ul");
    ul.append(listItem);
}

function uploadInput(textArea) {

    const listName = Main.getCurrentListName();
    const list = JSON.parse(Main.getList(listName));
    list.push(textArea.value);
    Main.updateStorage(listName, list);
}

function updateHeight(textArea) {
    // auto grow
    if (textArea.scrollHeight > textArea.clientHeight) {
        textArea.style.height = `${textArea.scrollHeight}px`;
    }
}

function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) &&
            !(code === 32)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};