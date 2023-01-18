import * as Main from "../main.js";

export default class ListItem extends HTMLElement {
    static get observedAttributes() {
        return ['checked', 'nightmode'];
    }

    constructor() {
        super();
        let template = document.getElementById("list-item");
        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        // add ID
        attachId(this);
        attachEventListeners(this);
        // How can touch, checkbox, and textbox coexist?
        // attachMobileTouch(this);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'checked') {
            applyStateChanges(this, newVal);
        }
        if (name === 'nightmode') {
            console.log("fire")
            applyNightMode(this, newVal);
        }
    }
}

function attachId(current) {
    const id = document.querySelector("main ul").childElementCount - 1;
    current.setAttribute('id', id);
}

function applyStateChanges(current, newVal) {
    const span = current.querySelector("span");
    const p = current.shadowRoot.querySelector("p");
    if (newVal === "true") {
        span.setAttribute("contenteditable", false);
        p.classList.add("checked");
    } else {
        p.classList.remove("checked");
        span.setAttribute("contenteditable", true);
    }
}

function applyNightMode(current, newVal) {
    const div = current.shadowRoot.querySelector("div");
    if (newVal === "true") {
        div.classList.add("dark-mode");
    } else {
        div.classList.remove("dark-mode");
    }
}

function attachEventListeners(current) {
    const curList = sessionStorage.getItem("current");
    const checkbox = current.shadowRoot.querySelector("input");

    if (curList === "Done") {
        current.setAttribute("checked", "true");
        checkbox.setAttribute("checked", "true");
    }

    // const textArea = document.querySelector("input-item");   
    checkbox.addEventListener('click', (e) => {
        current.setAttribute("checked", `${e.target.checked}`);
    })
    current.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.activeElement.blur();
            Main.updateTodoItem(current);
        }
    })
}


function deployMobileTouch(current) {
    current.addEventListener('touchstart', handleStart);
    current.addEventListener('touchend', handleEnd);
    current.addEventListener('touchmove', handleMove);

    let moving = null;

    function handleStart(e) {
        e.stopPropagation();
        e.preventDefault();
        current.style.opacity = '0.4';
        const div = current.shadowRoot.querySelector('div')
        div.classList.add('over');

        moving = (e.target.tagName === 'SPAN') ? e.target.parentNode : e.target
        moving.style.height = moving.clientHeight;
        moving.style.width = moving.clientWidth;
        moving.style.position = 'fixed';
        moving.style.zIndex = '-10';

        console.log('I was touched')
    }

    function handleMove(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('I was moved')
        if (moving) {
            // touchmove - assuming a single touchpoint
            moving.style.left = `${e.changedTouches[0].clientX - moving.clientWidth / 2}px`;
            moving.style.top = `${e.changedTouches[0].clientY - moving.clientHeight / 2}px`;
        }
    }

    function handleEnd(e) {
        e.stopPropagation();
        e.preventDefault();
        const div = current.shadowRoot.querySelector('div')
        div.classList.remove('over');
        current.style.opacity = '1.0';
        console.log('I was untouched')

        // SWIPED RIGHT
        if (moving) {
            moving.style.zIndex = '';
            checkSwipe(moving.style.left, current);
            // reset our element
            moving.style.left = '';
            moving.style.top = '';
            moving.style.height = '';
            moving.style.width = '';
            moving.style.position = '';


            moving = null;
        }
    }

    function checkSwipe(offset, current) {
        const leftOffset = parseInt(offset.split("px")[0]);
        if (leftOffset > 120) {
            // remove element from current page
            // cache onto different page
            current.remove();
        }

    }

}