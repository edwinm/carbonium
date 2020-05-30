import {$} from '../dist/bundle.min.js';

document.addEventListener('DOMContentLoaded', () => {
  $('#out').innerText = "Demo.";
  $('#hello-button').addEventListener('click', () => {
    $('#out').innerText = "Hello. It is working!";
  });
});
