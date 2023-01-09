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
        const curList = sessionStorage.getItem("current");
        const checkbox = this.shadowRoot.querySelector("input");

        if (curList === "Done") {
            this.setAttribute("checked", "true");
            checkbox.setAttribute("checked", "true");
        }

        // const textArea = document.querySelector("input-item");   
        checkbox.addEventListener('click', (e) => {
            this.setAttribute("checked", `${e.target.checked}`);
        })
        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.activeElement.blur();
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