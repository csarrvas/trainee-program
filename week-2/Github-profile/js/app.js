import {APIGithub} from './api.js';
import {UI} from './UI.js';

const form = document.querySelector('form');
const userInput = document.getElementById('user');
const input = document.querySelector('input[type="submit"]');

const API = new APIGithub();
const ui = new UI();

form.addEventListener('input', () => {
  if(!userInput.value) {
    input.setAttribute('disabled', '');
  }
  else {
    input.removeAttribute('disabled');
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const user = userInput.value.trim();

  API.searchUser(user).then(profile => {
    if(!profile) {
      ui.printError(`The user "${user}" does not exist`);
    }
    else {
      ui.printUser(profile);
    }
  
  }).catch(error => {
    ui.printError(`There is a problem with your request: ${error}`);
  });
});