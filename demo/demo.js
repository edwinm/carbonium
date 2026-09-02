// The locally built library, so `npm start` shows your own changes
const importPromise = import("../dist/bundle.min.js");

// To try the published version instead, use this import:
// const importPromise = import(
//   "https://cdn.jsdelivr.net/npm/carbonium/dist/bundle.min.js"
// );

const loadPromise = new Promise((resolve) => {
  document.addEventListener("DOMContentLoaded", resolve);
});

// Start code when both carbonium and the page are loaded
Promise.all([importPromise, loadPromise]).then(([{ $ }]) => {
  $("#out").innerText = "Demo.";
  $("#hello-button").addEventListener("click", () => {
    $("#out").innerText = "Hello. It is working!";
  });
});
