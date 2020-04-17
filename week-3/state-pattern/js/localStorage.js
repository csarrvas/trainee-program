export class Localstorage {
  saveAll(db) {
    localStorage.setItem('db', JSON.stringify(db));

    if (!localStorage.getItem('move')) {
      localStorage.setItem('move', 0);
    }
  }

  getAll() {
    return JSON.parse(localStorage.getItem('db'));
  }

  setNextId(id) {
    localStorage.setItem('nextId', id);
  }

  getNextId() {
    const nextId = parseInt(localStorage.getItem('nextId'));
    const newNextId = nextId + 1;
    this.setNextId(newNextId);

    return nextId;
  }

  getMove(type) {
    if (!localStorage.getItem('move')) {
      localStorage.setItem('move', 0);
      return 0;
    }

    const actual = parseInt(localStorage.getItem('move'));
    const cont = this.getAll().posts.length;

    if (type === 'previous') {
      if ((actual - 1) < 0) {
        localStorage.setItem('move', cont - 1);
        return cont - 1;
      }
      localStorage.setItem('move', actual - 1);
      return actual - 1;

    } else if (type === 'next') {
      if ((actual + 1) >= cont) {
        localStorage.setItem('move', 0);
        return 0;
      }
      localStorage.setItem('move', actual + 1);
      return actual + 1;
    }
  }

  getIdByTitle(title) {
    const posts = this.getAll().posts;
    let id = -1;

    posts.forEach((post, index) => {
      if (post.title === title) {
        id = index;
      }
    });

    return id;
  }

  deletePost() {
    const db = this.getAll();
    const actual = parseInt(localStorage.getItem('move'));
    db.posts.splice(actual, 1);

    this.saveAll(db);
  }

  editPost(image, title, subTitle, body) {
    const db = this.getAll();
    const actual = parseInt(localStorage.getItem('move'));

    db.posts[actual].image = image;
    db.posts[actual].title = title;
    db.posts[actual].subTitle = subTitle;
    db.posts[actual].body = body;

    this.saveAll(db);
  }

  giveALike() {
    const db = this.getAll();
    const actual = parseInt(localStorage.getItem('move'));

    db.posts[actual].likes += 1;

    this.saveAll(db);
  }
}