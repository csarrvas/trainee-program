import { PageState } from './pageState.js';
import { HomepageState } from './homepageState.js';
import { CreateState } from './createState.js';
import { SingleState } from './singleState.js';
import { SearchState } from './searchState.js';
import { DeleteState } from './deleteState.js';
import { EditState } from './editState.js';
import { DB } from './db.js';
import { Localstorage } from './localStorage.js';

const links = document.querySelectorAll('nav a');
const linkHomepage = document.getElementById('homepage');
const linkCreate = document.getElementById('create-page');
const linkSingle = document.getElementById('single-page');
const linkSearch = document.getElementById('search-page');
const linkDelete = document.getElementById('delete-page');
const linkEdit = document.getElementById('edit-page');

const data = new DB();
const page = new PageState();
const ls = new Localstorage();
let db = '';

Array.prototype.orderByNumber=function(property,sortOrder){
  if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
  this.sort(function(a,b){
    return (a[property]-b[property])*sortOrder;
  });
}

Array.prototype.orderByString=function(property,sortOrder,ignoreCase){
  if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
  this.sort(function(a, b){
    var stringA=a[property],stringB=b[property];
    if (stringA==null) stringA = '';
    if (stringB==null) stringB = '';
    if (ignoreCase==true){stringA=stringA.toLowerCase();stringB=stringB.toLowerCase()}
    var res = 0;
    if (stringA<stringB) res = -1;
    else if (stringA>stringB) res = 1;
    return res*sortOrder;
  });
}

data.getAll().then(db_data => {
  if (!ls.getAll()) {
    ls.saveAll(db_data);
    ls.setNextId(db_data.posts[db_data.posts.length-1].id + 1);
    db = db_data;
  }
});

linkHomepage.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  db = ls.getAll();
  page.change(new HomepageState(db));
});

linkCreate.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  db = ls.getAll();
  page.change(new CreateState(db));
});

linkSingle.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  page.change(new SingleState());
});

linkSearch.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  page.change(new SearchState());
});

linkDelete.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  page.change(new DeleteState());
});

linkEdit.addEventListener('click', (e) => {
  e.preventDefault();
  selected(e.target);
  page.change(new EditState());
});

function selected(link) {
  links.forEach(link => link.removeAttribute('class'));
  link.classList.add('active');
}