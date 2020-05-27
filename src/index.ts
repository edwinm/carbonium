import {$} from "./miq"

console.log('Playground');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('out').textContent = "Done.";

  // console.log(miq('p').textContent);

  // miq('p').textContent = 'bla';

  // miq('p').setAttribute('aria-label', 'List item');

  const el = $('p')
    .forEach((el) => el.title = 'Hello')
    .setAttribute('aria-label', 'List item')
    .filter((el) => el.textContent == 'twee')
    .textContent = 'bla';

  console.log('el', el);
});

