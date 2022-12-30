import ListItem from "./components/List-Item.js";
import Menu from "./components/Menu.js";
import InputItem from "./components/Input-Item.js";
window.addEventListener("load", init);


function init() {
    customElements.define("list-item", ListItem);
    customElements.define("menu-block", Menu);
    customElements.define("input-item", InputItem);


    console.log("DOM LOADED");
}