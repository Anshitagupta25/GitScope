
console.log("GitScope JavaScript connected!");

// Select the search form
const searchForm = document.getElementById("search-form");

console.log("Search form found:", searchForm);

// Escape HTML characters from GitHub API text
function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Listen for form submission
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Please enter a GitHub username.");
        return;
    }

    console.log("GitHub username:", username);

    // Fetch GitHub profile data
    fetch("https://api.github.com/users/" + encodeURIComponent(username))
        .then(function(response) {

            if (!response.ok) {
                throw new Error("GitHub user not found!");
            }

            return response.json();
        })
        .then(function(data) {

            console.log("GitHub profile data:", data);

            // Display profile information
            document.getElementById("profile-name").textContent =
                data.name || data.login;

            document.getElementById("profile-avatar").src = data.avatar_url;

            document.getElementById("profile-username").textContent =
                "@" + data.login;

            document.getElementById("profile-bio").textContent =
                data.bio || "No bio available.";

            document.getElementById("followers-count").textContent =
                data.followers;

            document.getElementById("repositories-count").textContent =
                data.public_repos;

            document.getElementById("following-count").textContent =
                data.following;

            document.getElementById("gists-count").textContent =
                data.public_gists;

            // Calculate GitScope Score
            const repoScore = Math.min(data.public_repos, 20) * 2;

            const followerScore = Math.min(data.followers, 1000) / 25;

            const gistScore = Math.min(data.public_gists, 10) * 2;

            const githubScore = Math.round(
                repoScore + followerScore + gistScore
            );

            document.getElementById("github-score").textContent =
                githubScore;

            // Fetch GitHub repositories
            const reposUrl =
                "https://api.github.com/users/" +
                encodeURIComponent(username) +
                "/repos";

            fetch(reposUrl)
                .then(function(response) {

                    if (!response.ok) {
                        throw new Error("Unable to fetch repositories!");
                    }

                    return response.json();
                })
                .then(function(repos) {

                    console.log("Repositories data:", repos);

                    // Sort repositories by stars (highest first)
                    const sortedRepos = repos.sort(function(a, b) {
                        return b.stargazers_count - a.stargazers_count;
                    });

                    console.log("Sorted repositories:", sortedRepos);

                    // Select the top 3 repositories
                    const topRepos = sortedRepos.slice(0, 3);

                    console.log("Top 3 repositories:", topRepos);

                    // Select the repository container
                    const repositoryList =
                        document.getElementById("repository-list");

                    // Create HTML for repository cards
                    let repositoryHTML = "";

                    topRepos.forEach(function(repo) {

                        repositoryHTML += `
                            <div class="repository-row">
                                <div>
                                    <strong>${escapeHTML(repo.name)}</strong>

                                    <p>${escapeHTML(
                                        repo.description || "No description available."
                                    )}</p>

                                    <p>${escapeHTML(
                                        repo.language || "Language not specified"
                                    )}</p>
                                </div>

                                <span>★ ${repo.stargazers_count.toLocaleString()}</span>
                            </div>
                        `;

                    });

                    // Display repository cards
                    if (topRepos.length === 0) {
                        repositoryHTML =
                            "<p class='note'>No public repositories found.</p>";
                    }

                    repositoryList.innerHTML = repositoryHTML;

                    // Count programming languages
                    const languageCount = {};

                    repos.forEach(function(repo) {

                        const language = repo.language;

                        if (language) {
                            languageCount[language] =
                                (languageCount[language] || 0) + 1;
                        }

                    });

                    console.log("Language Count:", languageCount);

                    // Calculate total repositories with a known language
                    let totalLanguageRepos = 0;

                    for (let language in languageCount) {
                        totalLanguageRepos += languageCount[language];
                    }

                    // Generate dynamic language HTML
                    const languageList =
                        document.getElementById("language-list");

                    let languageHTML = "";

                    if (totalLanguageRepos === 0) {

                        languageHTML =
                            "<p class='note'>No language data available.</p>";

                    } else {

                        for (let language in languageCount) {

                            const percentage =
                                (languageCount[language] / totalLanguageRepos) * 100;

                            languageHTML += `
                                <div class="language-row">
                                    <span>${escapeHTML(language)}</span>
                                    <span>${percentage.toFixed(2)}%</span>
                                </div>

                                <div class="bar">
                                    <div class="bar-fill"
                                        style="width: ${percentage}%">
                                    </div>
                                </div>
                            `;

                        }

                    }

                    // Display language information
                    languageList.innerHTML = languageHTML;

                })
                .catch(function(error) {
                    console.error("Repository Error:", error);
                    document.getElementById("repository-list").innerHTML =
                        "<p class='note'>Unable to load repositories.</p>";
                });

        })
        .catch(function(error) {
            console.error("Profile Error:", error);
            alert(error.message);
        });

});
