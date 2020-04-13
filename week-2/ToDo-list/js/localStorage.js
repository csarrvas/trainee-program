export class LocalStorage {
  constructor() {
    this.getReady();
  }

  getReady() {
    if(!localStorage.getItem('nextIdTask')) {
      localStorage.setItem('nextIdTask', '0');
      localStorage.setItem('tasks', JSON.stringify([]));
    }

    Array.prototype.orderByNumber = function(property, sortOrder) {
      if (sortOrder != -1 && sortOrder != 1) sortOrder = 1;
      this.sort(function (a, b) {
        return (a[property] - b[property]) * sortOrder;
      });
    }
  }

  getNewId() {
    return parseInt(localStorage.getItem('nextIdTask'));
  }

  setNewNextId() {
    const id = parseInt(localStorage.getItem('nextIdTask'));
    localStorage.setItem('nextIdTask', `${id + 1}`);
  }

  getTaskFromLocalStorage(id) {
    const tasks = this.getAllTasksFromLocalStorage();
    const taskFound = tasks.filter((task) => task.id === id);

    return taskFound.length ? taskFound[0] : false;
  }

  getAllTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
  }

  getAllTasksInOrderFromLocalStorage(sort) {
    const tasks = this.getAllTasksFromLocalStorage();

    if(tasks.length === 1) {
      return tasks;

    } else if (sort === 'byId') {
      tasks.orderByNumber('id', 1);
      return tasks;

    } else if (sort === 'byDate') {
      tasks.orderByNumber('date', 1);
      return tasks;
    }
  }

  insertTaskInLocalStorage(task) {
    const tasks = this.getAllTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  updateTaskInLocalStorage(taskUpdated) {
    const tasks = this.getAllTasksFromLocalStorage();

    const tasksUpdated = tasks.map((task) =>
      task.id === taskUpdated.id ? taskUpdated : task
    );

    localStorage.setItem('tasks', JSON.stringify(tasksUpdated));
  }

  deleteTaskInLocalStorage(id) {
    const tasks = this.getAllTasksFromLocalStorage();

    const tasksUpdated = tasks.filter((task) =>
      task.id !== id
    );

    localStorage.setItem('tasks', JSON.stringify(tasksUpdated));
  }

  deleteAllTasksFromLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify([]));
  }
}