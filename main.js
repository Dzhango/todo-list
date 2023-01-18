import ListItem from "./components/List-Item.js";
import InputItem from "./components/Input-Item.js";
customElements.define("list-item", ListItem);
customElements.define("input-item", InputItem);

window.addEventListener("load", init);

function init() {
    attachEventListeners();
    renderPage();
}

function devAlert(e) {
    console.trace();
    console.error(e)
}

function attachEventListeners() {
    window.addEventListener("click", (e) => {
        attachEventHandlers(e.target);
    })
}

function attachEventHandlers(targetNode) {
    // WHAT TO DO? 
    if (targetNode.classList.contains("add")) {
        handleAdd();
    } else if (targetNode.classList.contains("more")) {
        handleMore();
    } else if (targetNode.classList.contains("nightmode")) {
        handleNightMode();
    }

    // CLICK AWAY, HIDE MENU, WHERE TO PUT THIS CHUNK??
    if (!document.querySelector('#dropdown ul').contains(targetNode) &&
        !document.querySelector('.more').contains(targetNode)) {
        const menu = document.querySelector("#dropdown");
        menu.style.display = "none";
        const icon = document.querySelector(".more i");
        icon.classList.toggle("rotate");
    }
}

export function renderPage() {
    // Update item 
    const currentListName = sessionStorage.getItem('current') === null ? 'Inbox' : sessionStorage.getItem('current');

    const itemsList = getList(currentListName);

    if (itemsList === null) {
        devAlert()
        return;
    }

    const nightmodeEnabled = sessionStorage.getItem("nightmodeEnabled");
    renderNightmode(nightmodeEnabled);

    renderTodoItems(itemsList);

    // update header
    const p = document.querySelector("header p");
    p.innerText = currentListName;

}

export function renderTodoItems(itemsList) {

    try {
        const list = JSON.parse(itemsList);
        const ul = document.querySelector("ul");
        ul.innerHTML = "";
        const nightmodeEnabled = sessionStorage.getItem("nightmodeEnabled");
        list.forEach(element => {
            renderItem(element, { parent: ul, nightmodeEnabled: nightmodeEnabled });
        });
    } catch (e) {
        devAlert(e);
    }
}

export function getList(listName) {
    let output = localStorage.getItem(listName);
    // if does not exist, create()
    if (output === null) {
        if (createNewList(listName)) {
            output = localStorage.getItem(listName);
        } else {
            throw new Error("failed to create new list")
        }
    }
    return output;
}

export function createNewList(listName) {
    try {
        localStorage.setItem(listName, '[]');
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

export function getCurrentListName() {
    return sessionStorage.getItem('current') === null ? undefined : sessionStorage.getItem('current');;
}

export function renderItem(el, options) {

    const span = document.createElement("span");
    span.setAttribute("slot", "text");
    span.setAttribute("contenteditable", "true");
    span.innerText = el;
    const listItem = document.createElement("list-item");
    listItem.appendChild(span);

    const enabled = (options.nightmodeEnabled === 'true') ? 'true' : 'false';
    listItem.setAttribute("nightmode", enabled);

    options.parent.append(listItem);
}

export function updateTodoItem(current) {
    const currentListName = getCurrentListName();
    const todoListString = getList(currentListName);
    const todoList = JSON.parse(todoListString);

    const id = parseInt(current.id);
    const updatedText = current.querySelector("span").innerText;
    todoList[id] = updatedText;

    updateStorage(currentListName, todoList);
}

export function updateStorage(currentListName, todoList) {
    localStorage.setItem(currentListName, JSON.stringify(todoList));
}

function renderNightmode(enabled) {
    const body = document.querySelector('body');
    if (enabled === "true") {
        body.classList.add('dark-mode');
        const divs = document.querySelectorAll(".menu");
        divs.forEach(div => {
            div.classList.add("dark-mode");
            div.classList.add("dark-mode-border")
        })
    } else {
        body.classList.remove('dark-mode');

        const divs = document.querySelectorAll(".menu");
        divs.forEach(div => {
            div.classList.remove("dark-mode");
            div.classList.remove("dark-mode-border")
        })
    }
}

function handleAdd() {
    const root = document.querySelector("input-item").shadowRoot;
    const textarea = root.querySelector("textarea");
    textarea.style.display = "block";
    textarea.focus();
}

function handleMore() {
    const menu = document.querySelector("#dropdown");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none"
    }

    const lis = menu.querySelectorAll("li");
    lis.forEach(li => {
        li.addEventListener("click", (e) => {
            const cur = e.target.innerText;
            sessionStorage.setItem('current', cur)
            renderPage(cur);
        })
    })

    const icon = document.querySelector(".more i");
    icon.classList.toggle("rotate");
}

function handleNightMode() {

    // toggle dark mode
    const currentMode = sessionStorage.getItem("nightmodeEnabled");
    if (currentMode === "true") {
        sessionStorage.setItem("nightmodeEnabled", "false");

        const lis = document.querySelectorAll("list-item");
        lis.forEach(li => {
            li.setAttribute("nightmode", 'false')
        })
        renderNightmode("false");
    } else {
        sessionStorage.setItem("nightmodeEnabled", "true");

        const lis = document.querySelectorAll("list-item");
        lis.forEach(li => {
            li.setAttribute("nightmode", 'true')
        })
        renderNightmode("true");
    }
}