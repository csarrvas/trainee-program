export class APIGithub {
  constructor() {
    this.url = 'https://api.github.com/users/';
  }

  async searchUser(user) {
    const profileUrl = await fetch(this.url + user);
    const profile = await profileUrl.json();

    if(profile.message === 'Not Found') {
      return false;
    }
    else {
      const reposUrl = await fetch(this.url + user + '/repos');
      const repos = await reposUrl.json();

      const starredUrl = await fetch(this.url + user + '/starred');
      const starred = await starredUrl.json();

      profile.repos = repos;
      profile.starred = starred;

      return profile;
    }
  }
}