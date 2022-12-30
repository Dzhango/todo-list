export default class Menu extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById("menu");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {}
}