document.addEventListener("DOMContentLoaded", async () => {
  const { $ } = await import(
    "https://cdn.jsdelivr.net/npm/carbonium/dist/bundle.min.js"
  );

  $("#out").innerText = "Demo.";
  $("#hello-button").addEventListener("click", () => {
    $("#out").innerText = "Hello. It is working!";
  });
});
