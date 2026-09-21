
const teamMembers = document.getElementById("teamMembers");
const teamSummary = document.getElementById("teamSummary");

function getProjects() {
    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const currentProject =
        JSON.parse(localStorage.getItem("project"));

    // Support older projects saved under the single key
    if (projects.length === 0 && currentProject) {
        return [currentProject];
    }

    return projects;
}

function getTeamsByProject() {
    return JSON.parse(
        localStorage.getItem("teamsByProject")
    ) || {};
}

function saveTeamsByProject(teams) {
    localStorage.setItem(
        "teamsByProject",
        JSON.stringify(teams)
    );
}

function getProjectId(project, index) {
    return project.id ||
        project.projectId ||
        `project-${index}`;
}

function getInitials(name) {
    if (!name) return "ST";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function displayTeam() {
    const projects = getProjects();
    const teamsByProject = getTeamsByProject();

    // Migrate old team data to the current project
    const oldTeam =
        JSON.parse(localStorage.getItem("team")) || [];

    const currentProject =
        JSON.parse(localStorage.getItem("project"));

    if (
        oldTeam.length > 0 &&
        currentProject &&
        projects.length > 0
    ) {
        const currentIndex = projects.findIndex(
            project =>
                project.id === currentProject.id ||
                project.projectId === currentProject.projectId
        );

        const index = currentIndex >= 0 ? currentIndex : 0;

        const projectId = getProjectId(
            projects[index],
            index
        );

        if (!teamsByProject[projectId]) {
            teamsByProject[projectId] = oldTeam;
            saveTeamsByProject(teamsByProject);
        }
    }

    let totalMembers = 0;

    projects.forEach((project, index) => {
        const projectId = getProjectId(project, index);
        const team = teamsByProject[projectId] || [];

        totalMembers += team.length;
    });

    teamSummary.innerHTML = `
        <div>
            <span>TOTAL PROJECTS</span>
            <strong>${projects.length}</strong>
        </div>

        <div>
            <span>TOTAL TEAM MEMBERS</span>
            <strong>${totalMembers}</strong>
        </div>
    `;

    if (projects.length === 0) {
        teamMembers.innerHTML = `
            <div class="empty-team">
                <div class="empty-icon">👥</div>

                <h2>No projects found</h2>

                <p>
                    Create a project to start building your team.
                </p>

                <a href="project.html" class="primary-btn">
                    Create Project
                </a>
            </div>
        `;

        return;
    }

    teamMembers.innerHTML = "";

    projects.forEach((project, index) => {
        const projectId = getProjectId(project, index);

        const team = teamsByProject[projectId] || [];

        const projectCard = document.createElement("section");

        projectCard.className = "project-team-section";

        projectCard.innerHTML = `
            <div class="project-team-header">

                <div>
                    <span class="page-label">
                        PROJECT ${index + 1}
                    </span>

                    <h2>
                        ${escapeHTML(
                            project.projectName ||
                            project.name ||
                            "Untitled Project"
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            project.description ||
                            "Project team members"
                        )}
                    </p>
                </div>

                <div class="project-team-count">
                    ${team.length} /
                    ${project.teamSize || "—"}
                </div>

            </div>

            <div class="team-grid-inner"></div>
        `;

        const grid = projectCard.querySelector(
            ".team-grid-inner"
        );

        if (team.length === 0) {
            grid.innerHTML = `
                <div class="empty-project-team">

                    <p>
                        No members added to this project yet.
                    </p>

                    <a href="matches.html" class="primary-btn">
                        Find Teammates
                    </a>

                </div>
            `;
        } else {
            team.forEach((student, memberIndex) => {
                const card = document.createElement("article");

                card.className = "team-card";

                const skills = Array.isArray(student.skills)
                    ? student.skills
                    : [];

                card.innerHTML = `
                    <div class="team-card-header">

                        <div class="student-identity">

                            <div class="student-avatar">
                                ${escapeHTML(
                                    getInitials(student.name)
                                )}
                            </div>

                            <div>
                                <h3>
                                    ${escapeHTML(student.name)}
                                </h3>

                                <p>
                                    ${escapeHTML(student.email)}
                                </p>
                            </div>

                        </div>

                        <span class="team-number">
                            ${memberIndex + 1}
                        </span>

                    </div>

                    <span class="professional-role">
                        ${escapeHTML(
                            student.role || "Not specified"
                        )}
                    </span>

                    <div class="team-card-section">

                        <h4>Skills</h4>

                        <div class="student-tags">

                            ${
                                skills.length > 0
                                    ? skills.map(skill =>
                                        `<span class="student-skill">
                                            ${escapeHTML(skill)}
                                        </span>`
                                    ).join("")
                                    : "<span>Not specified</span>"
                            }

                        </div>

                    </div>

                    <div class="team-card-details">

                        <div>
                            <span>EXPERIENCE</span>

                            <strong>
                                ${escapeHTML(
                                    student.experience ||
                                    "Not specified"
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>AVAILABILITY</span>

                            <strong>
                                ${escapeHTML(
                                    student.availability ||
                                    "Not specified"
                                )}
                            </strong>
                        </div>

                    </div>
                `;

                grid.appendChild(card);
            });
        }

        teamMembers.appendChild(projectCard);
    });
}

function clearTeam() {
    const currentProject =
        JSON.parse(localStorage.getItem("project"));

    if (!currentProject) {
        alert("No current project found.");
        return;
    }

    const projects = getProjects();
    const teamsByProject = getTeamsByProject();

    const index = projects.findIndex(
        project =>
            project.id === currentProject.id ||
            project.projectId === currentProject.projectId
    );

    const projectIndex = index >= 0 ? index : 0;

    const projectId = getProjectId(
        projects[projectIndex],
        projectIndex
    );

    const team = teamsByProject[projectId] || [];

    if (team.length === 0) {
        alert("This project's team is already empty.");
        return;
    }

    const confirmed = confirm(
        "Clear the team for this project only?"
    );

    if (!confirmed) return;

    teamsByProject[projectId] = [];

    saveTeamsByProject(teamsByProject);

    // Compatibility with older storage
    localStorage.setItem("team", JSON.stringify([]));

    displayTeam();
}

displayTeam();