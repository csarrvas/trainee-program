export class UI {
  constructor() {
    this.assigneeInput = document.getElementById('assignee');
    this.tbody = document.querySelector('tbody');
    this.form = document.getElementById('newTask');
    this.idInput = document.getElementById('id');
    this.submitInput = document.querySelector('input[type="submit"]');
    this.addedTasks = document.getElementById('tasks');
    this.nameInput = document.getElementById('name');
    this.assigneeInput = document.getElementById('assignee');
    this.statusInput = document.getElementById('done');
    this.spinnerForm = document.getElementById('spinnerForm');
    this.spinnerTable = document.getElementById('spinnerTable');

    this.addedTasks.style.display = 'none';
  }
  insertAllTasksInTable(tasks) {
    this.tbody.innerHTML = '';
    tasks.forEach(task => {
      this.insertTaskInTable(task);
    });
  }

  resetForm() {
    this.form.reset();
    this.submitInput.value = 'Create task';
  }

  setNewIdInForm(id) {
    this.idInput.value = id;
  }

  insertTaskInTable(task) {
    if (this.addedTasks.style.display === 'none') {
      this.addedTasks.style.display = 'block';
    }
    
    const assignee = this.assigneeInput.options[parseInt(task.assignee)].text;
    const status = task.status === 1 ? 'Done' : 'Pending';
    const d = new Date();
    d.setTime(task.date);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.name}</td>
      <td>${assignee}</td>
      <td>${status}</td>
      <td>${d.getDate()}/${d.getMonth() +1}/${d.getFullYear()} ${d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</td>
      <td>
        <a href="#" class="edit" data-id="${task.id}">X</a>
      </td>
      <td>
        <a href="#" class="remove" data-id="${task.id}">X</a>
      </td>`;

    this.tbody.append(row);
  }

  printMessage(messages, place, color) {
    const div = document.createElement('div');
    div.className = `${color} message`;

    messages.forEach(message => {
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(message));
      div.appendChild(p);
    });
    
    if (place === 'form' || place === 'afterForm') {
      this.spinner('spinnerForm');
    } else if (place === 'table') {
      this.spinner('spinnerTable');
    }
    setTimeout(() => {
      if (place === 'form') {
        document.querySelector('fieldset').appendChild(div);

      } else if (place === 'table') {
        const divTask = document.getElementById('tasks');
        divTask.insertBefore(div, divTask.children[4]);

      } else if (place === 'afterForm') {
        const main = document.getElementsByTagName('main')[0];
        main.appendChild(div);
      }
      setTimeout(() => {
        div.remove();
      }, 2000);
    }, 1000);
  }

  updateTaskInTable(task) {
    this.deleteTaskInTable(task.id);
    this.insertTaskInTable(task);
  }

  deleteTaskInTable(id) {
    const rows = this.tbody.children;

    if(rows.length === 1) {
      this.addedTasks.style.display = 'none';
    }

    for (let row of rows) {
      if (parseInt(row.children[0].textContent) === id) {
        row.remove();
        break;
      }
    }
  }

  sortTasks(tasksInOrder) {
    this.insertAllTasksInTable(tasksInOrder);
  }

  searchAndFilterTasks (name, status) {
    const rows = this.tbody.children;
    for (let row of rows) {
      if (row.children[1].textContent.includes(name) && (status == 'both' || row.children[3].textContent == status)) {
        row.style.display = 'table-row';
      }
      else {
        row.style.display = 'none';
      }
    }
  }

  loadTaskInForm({id, name, assignee, status}) {
    this.idInput.value = id;
    this.nameInput.value = name;
    const select = document.getElementsByTagName('select')[0];
    select.value = assignee.toString();
    this.statusInput.checked = status;
    this.submitInput.value = 'Update task';
    this.submitInput.removeAttribute('disabled');
  }

  deleteAllTasksFromTable() {
    this.tbody.innerHTML = '';
    this.addedTasks.style.display = 'none';
  }

  spinner(name) {
    let spinner;
    if (name === 'spinnerForm') {
      spinner = this.spinnerForm;

    } else if (name === 'spinnerTable') {
      spinner = this.spinnerTable;
    }

    spinner.style.display = 'flex';

    setTimeout(() => {
      spinner.style.display = 'none';
    }, 1000);
  }
}