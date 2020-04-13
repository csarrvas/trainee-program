const SPINNER_DURATION = 2000;

export class UI {
  constructor() {
    this.container = document.querySelector('main');
  }

  printSpinner() {
    const previousUser = document.getElementById('profile');
    if (previousUser) {
      previousUser.remove();
    }

    const div = document.createElement('div');
    div.className = 'loader';
    this.container.append(div);

    setTimeout(() => {
      div.remove();
    }, SPINNER_DURATION);
  }

  printUser(profile) {
    this.printSpinner();
    
    setTimeout(() => {

      const div = document.createElement('div');
      div.id = 'profile';

      let repos = '';
      let starsCount = 0;

      profile.repos.forEach(repo => {
        repos += `<div>
          <p><span>Name: </span>${repo.name}</p>
          <p><span>Number of star: </span>${repo.stargazers_count}</p>
          <p><span>Number of forks: </span>${repo.forks_count}</p>
          <p><span>Number of watchers</span>${repo.watchers}</p>
          <p><span>Link to repository: </span><a href="${repo.html_url}" target="_blank"><i class="fas fa-external-link-alt"></i> ${repo.name}</a></p>
        </div>`;
        starsCount += repo.stargazers_count;
      });

      const date = new Date(profile.created_at);

      const info = `
        <figure id="user_photo">
          <img src="${profile.avatar_url}" alt="Photo of the user's profile">
          <figcaption>
            <p><span>Username: </span>${profile.login}</p>
          </figcaption>
        </figure>
        <div id="user_info">
          <p><span>Name: </span>${profile.name}</p>
          <p><span>Starred by the user: </span>${profile.starred.length}</p>
          <p><span>Stars in the user's repositories: </span>${starsCount}</p>
          <p><span>Number of repositories: </span>${profile.repos.length}</p>
          <p><span>Followers: </span>${profile.followers}</p>
          <p><span>Followings: </span>${profile.following}</p>
          <p><span>Company: </span>${profile.company ? profile.company : '-'}</p>
          <p><span>Website: </span>${profile.blog ? profile.blog : '-'}</p>
          <p><span>Location: </span>${profile.location ? profile.location : '-'}</p>
          <p><span>Member since: </span>${date.getDate()}/${date.getMonth() +1}/${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</p>
          <p><span>Link to profile: </span><a href="${profile.html_url}" target="_blank"><i class="fas fa-id-card"></i> ${profile.name}</a></p>
        </div>
        <div id="user_repos">
          ${profile.repos.length ? `<p>Repository list:</p>${repos}` : ''}
        </div>
      `;
      div.innerHTML = info;
      this.container.appendChild(div);

    }, SPINNER_DURATION);
  }

  printError(error) {
    this.printSpinner();

    setTimeout(() => {

      const div = document.createElement('div');
      div.id = 'error';
      const p = document.createElement('p');
      p.innerHTML = error;
      div.append(p);
      this.container.append(div);

      setTimeout(() => {
        div.remove();
      }, 3000);
      
    }, SPINNER_DURATION);
  }
}