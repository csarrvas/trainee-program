const spinner = document.querySelector('.loader');
const form = document.querySelector('form');
const input = document.querySelector('input[type="submit"]');
const salaryInput = document.getElementById('salary');
const yearsInput = document.getElementById('years');
const daysInput = document.getElementById('days');

form.addEventListener('submit', e => {
    e.preventDefault();
    validations();
    console.log()
});

form.addEventListener('input', () => {
    if(salaryInput.value === '' || yearsInput.value === '' || daysInput.value === '') {
        input.setAttribute('disabled', '');
        console.log('s')
    }
    else {
        input.removeAttribute('disabled');
        console.log('n')
    }
});

function validations() {
    const salary = parseFloat(salaryInput.value.trim());
    const years = parseInt(yearsInput.value.trim());
    const days = parseInt(daysInput.value.trim());
    const errors = [];

    errors.push('<span>Error<span>');
    if(isNaN(salary)) {
        errors.push('Enter a valid data type for the salary');
    }
    else if(salary < 0 || salary > 9999999) {
        errors.push('Enter a number between 0 and 9999999 for the salary');
    }
    if(isNaN(years)) {
        errors.push('Enter a valid data type for the salary');
    }
    else if(years < 0 || years > 35) {
        errors.push('Enter a number between 0 and 35 for the years');
    }
    if(isNaN(days)) {
        errors.push('Enter a valid data type for the salary');
    }
    else if(days < 0 || days > 365) {
        errors.push('Enter a number between 0 and 365 for the days');
    }
    if(errors.length > 1) {
        printErrors(errors);
    }
    else {
        const data = {
            salary: salary,
            years: years,
            days: days
        }
        calculate(data);
    }
}

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

function calculate(data) {
    let multiplier;
    if(data.years < 1) {
        multiplier = 15;
    }
    else if(data.years >= 1 && data.years < 3) {
        multiplier = 15;
    }
    else if(data.years >= 3 && data.years <= 10) {
        multiplier = 19;
    }
    else {
        multiplier = 21;
    }
    console.log(data);
    const bonus = (data.days*((data.salary / 30) * multiplier)) / 365;
    display(bonus);
}

function display(bonus) {
    const previous = document.getElementById('bonus');
    if(previous) {
        previous.remove();
    }
    const div = document.createElement('div');
    div.id = 'bonus';
    let p = document.createElement('p');
    p.textContent = `The bonus calculated for this person is: \$${bonus.toFixed(2)}`;
    div.append(p);
    spinner.style.display = 'block';
    input.style.display = 'none';
    setTimeout(() => {
        spinner.style.display = 'none';
        input.style.display = 'block';
        document.querySelector('main').append(div);
    }, 2000);
}