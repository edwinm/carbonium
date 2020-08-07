import { $ } from "../src/carbonium.js";
document.addEventListener("DOMContentLoaded", (event) => {
  class GolInfo extends HTMLElement {
    connectedCallback() {
      console.log("connectedCallback()");
      $("nnn").addEventListener("click", () => {});
      console.log("connectedCallback() end");
    }
  }
  customElements.define("gol-info", GolInfo);
  const i = document.createElement("gol-info");
  document.body.appendChild(i);
});
