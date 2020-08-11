document.addEventListener("DOMContentLoaded", (event) => {
  class GolInfo extends HTMLElement {
    connectedCallback() {
      console.log("connectedCallback()");
      // TODO: why carbonium.$ and not $? 😠
      // @see https://github.com/rollup/rollup/issues/3714
      carbonium.$("nnn").addEventListener("click", () => {});
      console.log("connectedCallback() end");
    }
  }
  customElements.define("gol-info", GolInfo);
  const i = document.createElement("gol-info");
  document.body.appendChild(i);
});
