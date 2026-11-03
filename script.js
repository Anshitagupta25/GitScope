console.log("GitScope JavaScript connected!");

const searchForm = document.getElementById("search-form");
console.log("Search form found:", searchForm);

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();
    
    console.log("Form submitted!");
    const username = document.getElementById("username").value;
    console.log("GitHub username:", username);

fetch("https://api.github.com/users/" + username)
    .then(function(response) {
        return response.json();
    })
.then(function(data) {
    console.log("GitHub profile data:", data);
    console.log("Following value:", data.following);

    document.getElementById("profile-name").textContent = data.name;
    document.getElementById("profile-avatar").src = data.avatar_url;
    document.getElementById("profile-username").textContent = "@" + data.login;
    document.getElementById("profile-bio").textContent = data.bio || "No bio available.";
    document.getElementById("followers-count").textContent = data.followers;
    document.getElementById("repositories-count").textContent = data.public_repos;
    document.getElementById("following-count").textContent = data.following;
    document.getElementById("gists-count").textContent = data.public_gists;
});

    });