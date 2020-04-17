import { Localstorage } from './localStorage.js';
const ls = new Localstorage();

export class UI {
  static hideArticles() {
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const filters = document.querySelectorAll('input[type="checkbox"]');
    const articles = document.querySelectorAll('article');
    
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        hide();
      });
    });

    function hide() {
      const tagsSelected = [];
      
      filters.forEach(filter => {
        if (filter.checked) {
          tagsSelected.push(filter.nextElementSibling.textContent.trim());
        }
      });

      if (!tagsSelected.length) {
        articles.forEach(article => {
          article.style.display = 'block';
        });

      } else {
        articles.forEach(article => {
          article.style.display = 'none';
        });
  
        tagsSelected.forEach(tag => {
          articles.forEach(article => {
            if (article.lastElementChild.firstElementChild.textContent.includes(tag)) {
              article.style.display = 'block';
            }
          });
        });
      }
    }
  }

  static createArticles(db) {
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const title_input = document.getElementById('title_input');
    const subTitle_input = document.getElementById('subtitle_input');
    const image_input = document.getElementById('url_input');
    const body_input = document.getElementById('body_input');
    const date_input = document.getElementById('date_input');
    const author_input = document.getElementById('author_input');
    const tags_input = document.getElementById('tags_input');
    const form = document.querySelector('form');

    form.addEventListener('submit', e => {
      e.preventDefault();
      validations();
    });

    function validations() {
      let post = {};
      const title = title_input.value.trim();
      const subTitle = subTitle_input.value.trim();
      const image = image_input.value.trim();
      const body = body_input.value.trim();
      const date = new Date(date_input.value.trim());
      const author = parseInt(author_input.value.trim());
      const tags = tags_input.value.trim();

      if (title, subTitle, image, body, date, author, tags) {
        post = {
          id: ls.getNextId(),
          title: title,
          subTitle: subTitle,
          image: image,
          body: body,
          createDate: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
          likes: 0,
          author: author,
          tags: fromTagsToTagsId(tags.split(', '))
        }
      }

      if (post) {
        db.posts.push(post);
        ls.saveAll(db);
        form.reset();

      } else {
        //error message
      }
    }

    function fromTagsToTagsId(tags) {
      const db = ls.getAll();
      const tagsObject = db.tags;

      let i;
      const tagsId = [];

      tagsObject.forEach((tag) => {
        i = tags.indexOf(tag.name);

        if (i !== -1) {
          tagsId.push(tag.id);
        }
      });

      return tagsId;
    }
  }

  displayPost() {
    document.getElementById('state').innerHTML = '';
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const div = document.createElement('div');
    div.id = 'buttons';
    div.innerHTML = `
      <button id="previous">Previous</button>
      <button id="like">Give a like</button>
      <button id="next">Next</button>
    `;
    document.querySelector('main').appendChild(div);

    const previous = document.getElementById('previous');
    const like = document.getElementById('like');
    const next = document.getElementById('next');

    previous.addEventListener('click', () => {
      this.printPost(parseInt(ls.getMove('previous')));
    });

    like.addEventListener('click', () => {
      ls.giveALike();
      this.printPost(parseInt(ls.getMove('next')));
    });

    next.addEventListener('click', () => {
      this.printPost(parseInt(ls.getMove('next')));
    });
    this.printPost(0);
  }

  printPost(i) {
    const db = ls.getAll();
    let date = [];
    let tagsOfPost = [];
    let thisAuthor = '';

    db.authors.forEach(author => {
      if (author.id === db.posts[i].author) {
        thisAuthor = `${author.name} ${author.lastName}`;
      }
    });

    date = db.posts[i].createDate.split('/');
    tagsOfPost = this.tagsName(db.tags, db.posts[i].tags);

    document.getElementById('state').innerHTML = `
      <p class="section" id="fieldset_post">Post</p>
      <section id="complete_post">
        <article>
          <figure class="image">
            <img src="${db.posts[i].image}" alt="${db.posts[i].title}">
            <figcaption class="title">
              <p>${db.posts[i].title}</p>
            </figcaption>
          </figure>
          <div class="subTitle">
            <p>${db.posts[i].subTitle}</p>
          </div>
          <div class="body">
            <p>${db.posts[i].body}</p>
          </div>
          <div class="author">
            <p><span>Author:</span> ${thisAuthor}</p>
          </div>
          <div class="createDate">
            <p>${date[2]}/${date[1]}/${date[0]}</p>
          </div>
          <div class="likes">
            <p><span>Likes:</span> ${db.posts[i].likes}</p>
          </div>
          <div class="tags">
            <p>${tagsOfPost.join(', ')}</p>
          </div>
        </article>
      </section>
    `;
  }

  tagsName(fullTags, eachTagsPost) {
    const tags = [];

    fullTags.forEach(tag => {

      eachTagsPost.forEach(tg => {

        if (tag.id === tg) {
          tags.push(tag.name);
        }

      });

    });

    return tags;
  }

  displayWantedPost() {
    document.getElementById('state').innerHTML = '';
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const div = document.createElement('div');
    div.id = 'search_div';
    div.innerHTML = `
      <input type="text" id="search_input" name="search_input" placeholder="Search by title" required>
      <button id="search">Search</button>
    `;
    document.querySelector('main').appendChild(div);

    const search = document.getElementById('search');

    search.addEventListener('click', () => {
      document.getElementById('state').innerHTML = '';
      const id = ls.getIdByTitle(document.getElementById('search_input').value.trim());
      if (id != -1) {
        this.printPost(id);
      } else {
        //No found
      }
    });
  }

  deletePost() {
    document.getElementById('state').innerHTML = '';
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const div = document.createElement('div');
    div.id = 'buttons';
    div.innerHTML = `
      <button id="previous">Previous</button>
      <button id="delete">Delete</button>
      <button id="next">Next</button>
    `;
    document.querySelector('main').appendChild(div);

    const previous = document.getElementById('previous');
    const deletePost = document.getElementById('delete');
    const next = document.getElementById('next');

    previous.addEventListener('click', () => {
      this.printPost(parseInt(ls.getMove('previous')));
    });

    deletePost.addEventListener('click', () => {
      ls.deletePost();
      this.printPost(parseInt(ls.getMove('next')));
    });

    next.addEventListener('click', () => {
      this.printPost(parseInt(ls.getMove('next')));
    });
    this.printPost(0);
  }

  editPost() {
    document.getElementById('state').innerHTML = '';
    if (document.getElementById('search_div')) {
      document.getElementById('search_div').remove();
    }
    if (document.getElementById('buttons')) {
      document.getElementById('buttons').remove();
    }

    const div = document.createElement('div');
    div.id = 'buttons';
    div.innerHTML = `
      <button id="previous">Previous</button>
      <button id="edit">Edit</button>
      <button id="next">Next</button>
    `;
    document.querySelector('main').appendChild(div);

    const previous = document.getElementById('previous');
    const editPost = document.getElementById('edit');
    const next = document.getElementById('next');

    previous.addEventListener('click', () => {
      this.printPostToEdit(parseInt(ls.getMove('previous')));
    });

    editPost.addEventListener('click', () => {
      const title = document.getElementById('title_input').value.trim();
      const subTitle = document.getElementById('subtitle_input').value.trim();
      const image = document.getElementById('url_input').value.trim();
      const body = document.getElementById('body_input').value.trim();

      ls.editPost(image, title, subTitle, body);

    });

    next.addEventListener('click', () => {
      this.printPostToEdit(parseInt(ls.getMove('next')));
    });
    this.printPostToEdit(0);
  }

  printPostToEdit(i) {
    const db = ls.getAll();

    document.getElementById('state').innerHTML = `
      <p class="section" id="fieldset_post">Edit post:</p>
      <form id="fields">
        <div>
          <input type="text" id="url_input" name="url_input" value="${db.posts[i].image}" required>
          <label for="url_input">URL of an image</label>
        </div>
        <div>
          <input type="text" id="title_input" name="url_input" value="${db.posts[i].title}" required>
          <label for="url_input">Title</label>
        </div>
        <div>
          <input type="text" id="subtitle_input" name="url_input" value="${db.posts[i].subTitle}" required>
          <label for="url_input">SubTitle</label>
        </div>
        <div>
          <input type="text" id="date_input" name="url_input" value="${db.posts[i].createDate}" readonly>
          <label for="url_input">Create Date</label>
        </div>
        <div>
          <textarea id="body_input" name="url_input" required rows="4">${db.posts[i].body}</textarea>
          <label for="url_input">Body</label>
        </div>
      </form>
    `;
  }
}