import {LocalStorage} from './localStorage.js';
import {UI} from './UI.js';

export class TaskList {
  constructor () {
    this.ls = new LocalStorage();
    this.ui = new UI();
    this.getReady();
  }

  getReady() {
    this.cleanForm();

    const tasks = this.ls.getAllTasksFromLocalStorage();
    if(tasks) {
      this.ui.insertAllTasksInTable(tasks);
    }
  }

  cleanForm() {
    this.ui.resetForm();
    const id = this.ls.getNewId();
    this.ui.setNewIdInForm(id);
  }

  validations({name, assignee}) {
    const errors = [];

    if (name.length <= 0 || name.length > 100) {
      errors.push('There is a problem with the name');
    }

    if (isNaN(assignee) || assignee <= 0 || assignee > 4) {
      errors.push('There is a problem with the assignee');
    }

    return errors.length ? errors : false;
  }

  insertTask (name, assignee, status) {
    const task = {
      id: this.ls.getNewId(),
      name: name,
      assignee: assignee,
      status: status,
      date: parseInt((new Date()).getTime())
    }

    const error = this.validations(task);

    if (!error) {
      this.ls.insertTaskInLocalStorage(task);
      this.ui.insertTaskInTable(task);
      this.ls.setNewNextId();
      this.ui.printMessage(['Task successfully added'], 'form', 'green');

    } else {
      this.ui.printMessage(error, 'form', 'red');
    }
    this.cleanForm();
  }

  updateTask (id, name, assignee, status) {
    const task = this.ls.getTaskFromLocalStorage(id);
    
    if (task) {
      task.name = name;
      task.assignee = assignee;
      task.status = status;
      task.date = parseInt((new Date()).getTime())

      const error = this.validations(task);

      if (!error) {
        this.ls.updateTaskInLocalStorage(task);
        this.ui.updateTaskInTable(task);
        this.ui.printMessage(['Task successfully edited'], 'form', 'green');

      } else {
        this.ui.printMessage(error, 'form', 'red');
      }
    } else {
      this.ui.printMessage(['This ID doesn\'t exist'], 'form', 'red');
    }
    this.cleanForm();
  }

  deleteTask (id) {
    if (this.ls.getTaskFromLocalStorage(id)) {
      this.ls.deleteTaskInLocalStorage(id);
      this.ui.deleteTaskInTable(id);
      this.ui.printMessage(['Task successfully removed'], 'table', 'green');

    } else {
      this.ui.printMessage(['This ID doesn\'t exist'], 'table', 'red');
    }
  }

  tools ({search, status, sort}) {
    const tasksInOrder = this.ls.getAllTasksInOrderFromLocalStorage(sort);
    this.ui.sortTasks(tasksInOrder);
    this.ui.searchAndFilterTasks(search, status);
    
  }

  loadInfoTask (id) {
    const task = this.ls.getTaskFromLocalStorage(id);

    if (task) {
      this.ui.loadTaskInForm(task);
      this.ui.printMessage(['Task successfully loaded'], 'table', 'blue');
      
    } else {
      this.ui.printMessage(['This ID doesn\'t exist'], 'table', 'red');
    }
  }

  deleteAllTasks () {
    this.ls.deleteAllTasksFromLocalStorage();
    this.ui.deleteAllTasksFromTable();
    this.ui.printMessage(['All tasks successfully removed'], 'afterForm', 'blue');
  }
}