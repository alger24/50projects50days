const API_URL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

// getUser('bradtraversy');

async function getUser(username) {
    try {
        const {data} = await axios(API_URL + username)
    
        createUserCard(data);

        getRepos(username);
    } catch(err) {
        if(err.response.status === 404) {
            createErrorCard('No profile with this username');
        }
    }
}

function createUserCard(user) {
    const cardHtml = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>

            <ul>
                <li>${user.followers} <strong>followers</strong></li>
                <li>${user.following} <strong>following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>

            <div class="repos"></div>
        </div>
    </div>`;

    main.innerHTML = cardHtml
}

async function getRepos(username) {
    try {
        const {data} = await axios(API_URL + username + '/repos?sort=created')
    
        addRepostToCard(data)
    } catch(err) {
        if(err.response.status === 404) {
            createErrorCard('Problem fetching repos');
        } else {
            console.log(err);
        }
        console.log(err)
    }
}

function createErrorCard(msg) {
    const cardHtml = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `;

    main.innerHTML = cardHtml;
}

function addRepostToCard(repos) {
    const reposEl = document.querySelector('.repos')

    repos.slice(0,10).forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name

        reposEl.appendChild(repoEl)
    });
}

form.addEventListener('submit', (eve) => {
    eve.preventDefault();

    const user = search.value;

    if(user) {
        getUser(user);
        search.value = ''
    }
})