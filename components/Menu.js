import renderCacheComponents from "./../main.js"

export default class Menu extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById("menu");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        const lis = this.shadowRoot.querySelectorAll("li");
        lis.forEach(li => {
            li.addEventListener("click", (e) => {
                const cur = e.target.innerText;
                renderCacheComponents(cur);
            })
        })
    }
}