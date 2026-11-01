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

    document.getElementById("profile-name").textContent = data.name;
    document.getElementById("profile-username").textContent = "@" + data.login;
    document.getElementById("followers-count").textContent = data.followers;
});

    });