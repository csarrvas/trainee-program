import {UI} from './ui.js';

export class HomepageState {
  constructor(page, db) {
    this.page = page;
    this.db = db;
    console.log(db);
    this.init();
  }

  init() {
    let tags = '';
    this.db.tags.forEach(tag => {
      tags += `
        <div class="tag">
          <input type="checkbox" id="${tag.slug}" name="${tag.slug}">
          <label for="${tag.slug}"> ${tag.name}</label>
        </div>`;
    });

    this.db.posts.orderByNumber('id', -1);
    this.db.posts.orderByString('createDate', -1, true);

    let lastPosts = '';
    let remainingPosts = '';
    let currentPost = '';
    let date = [];
    let tagsOfPost = [];

    this.db.posts.forEach((post, index) => {
      date = post.createDate.split('/');

      tagsOfPost = this.tagsName(this.db.tags, post.tags);

      currentPost = `
        <article>
          <figure class="image">
            <img src="${post.image}" alt="${post.title}">
            <figcaption class="title">
              <p>${post.title}</p>
            </figcaption>
          </figure>
          <div class="subTitle">
            <p>${post.subTitle}</p>
          </div>
          <div class="body">
            <p>${post.body.substring(0, 200)}...</p>
          </div>
          <div class="createDate">
            <p>${date[2]}/${date[1]}/${date[0]}</p>
          </div>
          <div class="tags">
            <p>${tagsOfPost.join(', ')}</p>
          </div>
        </article>`;

      if (index < 3) {
        lastPosts += currentPost;
      } else {
        remainingPosts += currentPost;
      }
    });

    document.getElementById('state').innerHTML = `
      <p class="section">Filter by:</p>
      <div id="tags">
        ${tags}
      </div>
      <p class="section">Last posts:</p>
      <section id="lastPosts">
        ${lastPosts}
      </section>
      <p class="section">Other posts:</p>
      <section id="remainingPosts">
        ${remainingPosts}
      </section>
    `;

    UI.hideArticles();
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
}