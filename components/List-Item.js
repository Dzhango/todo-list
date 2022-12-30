export default class ListItem extends HTMLElement {
    static get observedAttributes() {
        return ['checked'];
    }

    constructor() {
        super();
        let template = document.getElementById("list-item");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        const checkbox = this.shadowRoot.querySelector("input");
        const input = document.querySelector("input")
        checkbox.addEventListener('click', (e) => {
            this.setAttribute("checked", `${e.target.checked}`);
        })
        this.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key === 'Enter') {
                console.log("fired");
                input.focus();
            }
        })
    }

    attributeChangedCallback(name, oldVal, newVal) {
        const span = this.querySelector("span");
        const p = this.shadowRoot.querySelector("p");
        if (newVal === "true") {
            span.setAttribute("contenteditable", false);
            p.classList.add("checked");
        } else {
            p.classList.remove("checked");
            span.setAttribute("contenteditable", true);
        }
    }
}