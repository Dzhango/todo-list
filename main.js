import ListItem from "./components/List-Item.js";
import Menu from "./components/Menu.js";
import InputItem from "./components/Input-Item.js";
window.addEventListener("load", init);
customElements.define("list-item", ListItem);
customElements.define("menu-block", Menu);
customElements.define("input-item", InputItem);

function init() {
    console.log("DOM LOADED");

    deployEventListeners();
    renderCacheComponents("Inbox");
}

function deployEventListeners() {
    window.addEventListener("click", (e) => {
        let cur = null;
        if (e.target.tagName === "DIV") {
            cur = e.target.id;
        } else if (e.target.tagName === "I") {
            const classes = e.target.classList;
            cur = classes[classes.length - 1]
        }

        if (cur === "add") {
            handleAdd();
        } else if (cur === "more") {
            handleMore();
        } else if (cur === "nightmode") {
            handleNightMode();
        }

        if (!document.querySelector('#dropdown ul').contains(e.target) &&
            !document.querySelector('#more').contains(e.target)) {
            const menu = document.querySelector("#dropdown");
            menu.style.display = "none";
        }
    })
}

export default function renderCacheComponents(curList) {
    // localStorage: inbox, todo, done lists
    // preload todo components
    if (curList === null) {
        return;
    }

    const currentMode = sessionStorage.getItem("nightmodeEnabled");
    if (currentMode === "true") {
        handleNightMode();
    }

    const p = document.querySelector("header p");
    p.innerText = curList;

    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    const list = JSON.parse(localStorage.getItem(curList));
    if (list === null) {
        console.log("list is null");
        return;
    }

    list.forEach(element => {

        const span = document.createElement("span");
        span.setAttribute("slot", "text");
        span.setAttribute("contenteditable", "true");
        span.innerText = element;
        const listItem = document.createElement("list-item");
        listItem.appendChild(span);

        // nightmode modifications
        const nightMode = sessionStorage.getItem("nightmodeEnabled");
        if (nightMode === "true") {
            // handleNightMode();

            const div = listItem.shadowRoot.querySelector("div");
            div.classList.toggle("dark-mode");
        }

        ul.prepend(listItem);

    });
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
            renderCacheComponents(cur);
        })
    })
}

function handleNightMode() {

    // toggle dark mode
    const currentMode = sessionStorage.getItem("nightmodeEnabled");
    if (currentMode === "true") {
        sessionStorage.setItem("nightmodeEnabled", "false");
    } else {
        sessionStorage.setItem("nightmodeEnabled", "true");
    }
    const body = document.querySelector("body");
    body.classList.toggle("dark-mode");

    const lis = document.querySelectorAll("list-item");
    lis.forEach(li => {
        const div = li.shadowRoot.querySelector("div");
        div.classList.toggle("dark-mode");
    })

    const divs = document.querySelectorAll(".menu");
    divs.forEach(div => {
        div.classList.toggle("dark-mode");
        div.classList.toggle("dark-mode-border")
    })

    //input-item:
    //back

    //icons:grey background 
    // fa-light-switch for icons
}