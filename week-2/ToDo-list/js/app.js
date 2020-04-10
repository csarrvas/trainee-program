import {TaskList} from './taskList.js';

const form = document.getElementById('newTask');
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const assigneeInput = document.getElementById('assignee');
const statusInput = document.getElementById('done');
const submitInput = document.querySelector('input[type="submit"]');

const searchInput = document.getElementById('search');
const statusCheck = document.getElementsByName('statusCheck');
const sortInput = document.getElementsByName('sort');

const tbody = document.querySelector('tbody');
const removeAll = document.getElementById('removeAll');

const data = {
  search: '',
  status: 'both',
  sort: 'byId'
}

const taskList = new TaskList();

form.addEventListener('input', () => {
  if(!idInput.value || !nameInput.value || !assigneeInput.value) {
    submitInput.setAttribute('disabled', '');

  } else {
    submitInput.removeAttribute('disabled');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const assignee = parseInt(assigneeInput.options[assigneeInput.selectedIndex].value.trim());
  const status = statusInput.checked ? 1 : 0;

  if (submitInput.value === 'Create task') {
    taskList.insertTask(name, assignee, status);

  } else if (submitInput.value === 'Update task') {
    const id = parseInt(idInput.value.trim());
    taskList.updateTask(id, name, assignee, status);
  }
});

searchInput.addEventListener('keyup', (e) => {
  data.search = e.target.value.trim();
  taskList.tools(data);
});

for (let status of statusCheck) {
  status.onclick = (e) => {
    data.status = e.target.value;
    taskList.tools(data);
  }
}

for (let sort of sortInput) {
  sort.onclick = (e) => {
    data.sort = e.target.value;
    taskList.tools(data);
  }
}

tbody.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.className === 'edit') {
    const id = parseInt(e.target.getAttribute('data-id'));
    taskList.loadInfoTask(id);

  } else if (e.target.className === 'remove') {
    const id = parseInt(e.target.getAttribute('data-id'));
    taskList.deleteTask(id);
  }
});

removeAll.addEventListener('click', (e) => {
  e.preventDefault();

  taskList.deleteAllTasks();
});