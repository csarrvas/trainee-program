import {UI} from './ui.js';

export class CreateState {
  constructor(page, db) {
    this.page = page;
    this.db = db;  

    this.init();
  }

  init() {
    let options = '<option value="" selected disabled>Author</option>';
    this.db.authors.forEach(author => {
      options += `<option value="${author.id}">${author.name} ${author.lastName}</option>`;
    });

    let tags = '';
    this.db.tags.forEach(tag => {
      tags += `${tag.name}, `;
    });
    tags = tags.substring(0, tags.length-2);

    document.getElementById('state').innerHTML = `
      <p class="section" id="fieldset_post">Create post:</p>
      <form action="" id="fields">
        <div>
          <input type="text" id="url_input" name="url_input" required>
          <label for="url_input">URL of an image</label>
        </div>
        <div>
          <input type="text" id="title_input" name="url_input" required>
          <label for="url_input">Title</label>
        </div>
        <div>
          <input type="text" id="subtitle_input" name="url_input" required>
          <label for="url_input">SubTitle</label>
        </div>
        <div>
          <select id="author_input" name="url_input" required>
            ${options}
          </select>
        </div>
        <div>
          <input type="date" id="date_input" name="url_input" min="2018-01-01" max="${this.today()}" required>
          <label for="url_input">Create Date</label>
        </div>
        <div>
          <textarea id="body_input" name="url_input" required rows="4"></textarea>
          <label for="url_input">Body</label>
        </div>
        <div>
          <input type="text" id="tags_input" name="url_input" required>
          <label for="url_input">Tags separated by commas</label>
          <p id="availableTags">Tags available: ${tags}</p>
        </div>
        <input type="submit" value="Create">
      </form>
      `;

    UI.createArticles(this.db, this.action);
  }

  today() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 

    today = yyyy+'-'+mm+'-'+dd;
    return today;
  }
}