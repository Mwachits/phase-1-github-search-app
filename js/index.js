document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const toggleButton = document.createElement('button');

    let searchType = 'users'; // Default search type

    // Create and append the toggle button
    toggleButton.textContent = 'Search Repos';
    toggleButton.type = 'button';
    form.appendChild(toggleButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            if (searchType === 'users') {
                searchUsers(query);
            } else {
                searchRepos(query);
            }
        }
    });

    toggleButton.addEventListener('click', () => {
        searchType = searchType === 'users' ? 'repos' : 'users';
        toggleButton.textContent = searchType === 'users' ? 'Search Repos' : 'Search Users';
        // Clear the previous search results
        userList.innerHTML = '';
        reposList.innerHTML = '';
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
        });
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.classList.add('user-item');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userItem.addEventListener('click', () => {
                fetchRepos(user.login);
            });
            userList.appendChild(userItem);
        });
    }

    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayRepos(data);
        });
    }

    function displayRepos(repos) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.classList.add('repo-item');
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }

    function searchRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayRepoSearchResults(data.items);
        });
    }

    function displayRepoSearchResults(repos) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.classList.add('repo-item');
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
