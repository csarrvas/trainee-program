/*------------------------------VARIABLES------------------------------*/
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const assigneeInput = document.getElementById('assignee');
const doneInput = document.getElementById('done');
const form = document.getElementById('newTask');
const tbody = document.querySelector('tbody');
const inputSubmit = document.querySelector('input[type="submit"]');
const spinner = document.querySelector('.switch > div:nth-child(1)');
const spinner2 = document.getElementById('spinner2');
const removeAll = document.getElementById('removeAll');
const tools = document.getElementById('tools');
const search = document.getElementById('search');
var editable = undefined;

/*------------------------------LISTENERS------------------------------*/
//Listener para llenar con los datos iniciales (si los hay)
document.addEventListener('DOMContentLoaded', () => {
    setTasksToDom();
    generateID();
});

// Validation enable / disable of Create task
form.addEventListener('input', () => {
    if(idInput.value === '' || nameInput.value === '' || assigneeInput.value === '') {
        inputSubmit.setAttribute('disabled', '');
    }
    else {
        inputSubmit.removeAttribute('disabled');
    }
});

//Listener to submit of the form
form.addEventListener('submit', e => {
    e.preventDefault();
    validations();
});

//Listener of tools (search)
search.addEventListener('keyup', e => {
    toolSearch(e.target.value);
});

//Listener of tools (status / sort)
tools.addEventListener('click', e => {
    if(e.target.hasAttribute('name')) {
        const name = e.target.getAttribute('name');
        if(name === 'statusCheck') {
            toolStatus(e.target.value);
        }
        else if(name === 'sort') {
            toolSort(e.target.value);
        }
    }
});

//Listener to edit / remove each element
tbody.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.className === 'edit') {
        spinner2.style.display = 'block';
        setTimeout(() => {
            window.scrollTo(0,0);
            inputSubmit.style.display = 'block';
            spinner2.style.display = 'none';
        }, 2000);
        const tasks = getTasksFromLS();
        tasks.forEach(task => {
            if(task.id == e.target.getAttribute('data-id')) {
                const toEdit = task;
                editable = toEdit;
                loadToDom(toEdit);
            }
        });
    }
    else if(e.target.className === 'remove') {
        spinner2.style.display = 'block';
        setTimeout(() => {
            spinner2.style.display = 'none';
        }, 2000);
        e.target.parentElement.parentElement.remove();
        removeTaskFromLS(parseInt(e.target.getAttribute('data-id')));
    }
});

//Listener al remove all
removeAll.addEventListener('click', e => {
    spinner2.style.display = 'block';
    setTimeout(() => {
        spinner2.style.display = 'none';
    }, 2000);
    localStorage.removeItem('tasks');
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    document.getElementById('tasks').style.display = 'none';
    generateID();
});

/*------------------------------FUNCTIONS------------------------------*/

//Loading element to edit
function loadToDom (toEdit) {
    idInput.value = toEdit.id;
    nameInput.value = toEdit.name;
    const select = document.getElementsByTagName('select')[0];
    select.value = toEdit.assignee.toString();
    doneInput.checked = toEdit.status ? true : false;
    inputSubmit.removeAttribute('value');
    inputSubmit.setAttribute('value', 'Edit tasks');
}

//Continuation of search
function toolSearch(search) {
    let el = tbody.firstElementChild;
    let all = [];
    do {
        all.push(el);
        el = el.nextElementSibling;
    } while(el);

    all.forEach((element, i) => {
        if(element.firstElementChild.nextElementSibling.textContent.includes(search)) {
            element.style.display = "table-row";
        }
        else {
            element.style.display = "none";
        }
    });
}

//Continuation of status
function toolStatus(status) {
    let el = tbody.firstElementChild;
    do {
        if(status == 1) {
            el.style.display = 'table-row';
        }
        else if(status == 2 && el.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent === 'Pending'){
            el.style.display = 'table-row';
        }
        else if(status == 3 && el.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent === 'Done'){
            el.style.display = 'table-row';
        }
        else {
            el.style.display = 'none';
        }
        el = el.nextElementSibling;
    } while(el);
}

//Continuation of sort
function toolSort(sort) {
    let el = tbody.firstElementChild;
    let order1 = [];
    let order2 = [];

    if(sort == 1) {
        do {
            order1.push(parseInt(el.firstElementChild.textContent));
            order2.push(el);
            el = el.nextElementSibling;
        } while(el);
        order1.sort((a, b) => a - b);

        tbody.innerHTML = '';

        order1.forEach(num => {
            order2.forEach((element, i) => {
                if(num == element.firstElementChild.textContent) {
                    tbody.append(element);
                }
            });
        });
    }
    else if(sort == 2){
        const tasks = getTasksFromLS();
        const order = tasks.map(task => {
            return task.date;
        }).sort((a, b) => a - b);
        while(tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        order.forEach(num => {
            for(task in tasks) {
                if(tasks[task].date == num) {
                    addToDom(tasks[task]);
                }
            }
        });
        
    }
}

//ID generator
function generateID() {
    if(getTasksFromLS().length === 0) {
        idInput.value = 0;
    }
    else {
        const tasks = getTasksFromLS();
        idInput.value = tasks.map(task => {
            return task.id;
        }).sort((a, b) => b - a)[0] + 1;
    }
}

//Validations of tasks to enter
function validations() {
    const id = parseInt(idInput.value.trim());
    const name = nameInput.value.trim();
    const assignee = parseInt(assigneeInput.options[assigneeInput.selectedIndex].value.trim());
    const done = doneInput.checked;
    const d = new Date();
    const date = d.getTime();
    const errors = [];
    
    errors.push('<span>Error<span>');
    if(isNaN(id) ||  id < 0) {
        errors.push('There is a problem with the id');
    }
    if(name.length <= 0 || name.length > 100) {
        errors.push('There is a problem with the name');
    }
    if(isNaN(assignee) || assignee <= 0 || assignee > 4) {
        errors.push('There is a problem with the assignee');
    }
    if(typeof(Storage) === 'undefined'){
		errors.push('LocalStorage is not available');
    }
    const tasks = getTasksFromLS();
    tasks.forEach(function(task, index) {
        if(task.id === id && typeof editable === 'undefined') {
            errors.push('This id is already taken');
        }
    });
    if(errors.length > 1) {
        if(typeof editable != 'undefined') {
            errors.push('This task could not be modified');
            editable = undefined;
            inputSubmit.setAttribute('value', 'Create tasks');
            generateID();
            form.reset();
        }
        printErrors(errors);
    }
    else {
        const task = {
            id: id,
            name: name,
            assignee: assignee,
            status: (done ? 1 : 0),
            date: (typeof editable === 'undefined' ? date : editable.date)
        }
        addTask(task);
    }
}

//Mistakes in validations
function printErrors(errors) {
    const div = document.createElement('div');
    div.id = 'errors';
    errors.forEach( error => {
        let p = document.createElement('p');
        p.innerHTML = error;
        div.append(p);
    });
    form.append(div);
    setTimeout(() => {
        document.getElementById('errors').remove();
    }, 4000);
}

//Adding tasks
function addTask(task) {
    if(typeof editable != 'undefined') {
        removeTaskFromLS(parseInt(editable.id));
        let el = tbody.firstElementChild;
        do {
            if(el.firstElementChild.textContent == editable.id) {
                el.remove();
            }
            el = el.nextElementSibling;
        } while(el);
        inputSubmit.setAttribute('value', 'Create task');
    }
    spinner.style.display = 'block';
    inputSubmit.style.display = 'none';
    setTimeout(() => {
        addToDom(task);
        addToLS(task);
        setTasksToDom();
        form.reset();
        generateID();
        spinner.style.display = 'none';
        inputSubmit.style.display = 'block';
    }, 4000);
    
}

//To DOM
function addToDom(tasks) {
    document.getElementById('tasks').style.display = 'block';
    if(!Array.isArray(tasks)) {
        tasks = [tasks];
    }
    tasks.forEach(task => {
        const assignee = assigneeInput.options[parseInt(task.assignee)].text;
        let status;
        if(task.status == 1) {
            status = 'Done';
        }
        else {
            status = 'Pending';
        }
        let d = new Date();
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
        tbody.append(row);
    });
}

//To localStorage
function addToLS(task) {
    const tasks = getTasksFromLS();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    generateID();
}

//Loading all the tasks to DOM at the beginning
function setTasksToDom() {
    const tasks = getTasksFromLS();
    if(tasks.length > 0) {
        document.getElementById('tasks').style.display = 'block';
        tbody.innerHTML = '';
        addToDom(tasks);
    }
    else {
        document.getElementById('tasks').style.display = 'none';
    }
}

//Return array with task from localStorage
function getTasksFromLS() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

//Delete task of localStorage
function removeTaskFromLS(id) {
    const tasks = getTasksFromLS();
    tasks.forEach(function(task, index) {
        if(task.id === id) {
            tasks.splice(index, 1);
        }
    });
    if(tasks.length === 0) {
        localStorage.removeItem('tasks');
        document.getElementById('tasks').style.display = 'none';
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    generateID();
}