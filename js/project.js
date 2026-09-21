
const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const project = {
        id: "project-" + Date.now(),
        projectName: document.getElementById("projectName").value.trim(),
        description: document.getElementById("description").value.trim(),
        requiredSkills: document.getElementById("requiredSkills").value
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== ""),
        teamSize: Number(document.getElementById("teamSize").value),
        createdAt: new Date().toISOString()
    };

    // Get all previously saved projects
    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    // Add new project without deleting previous projects
    projects.push(project);

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    // Set this as the active project
    localStorage.setItem(
        "project",
        JSON.stringify(project)
    );

    // Initialize a separate team for this project
    const teamsByProject =
        JSON.parse(
            localStorage.getItem("teamsByProject")
        ) || {};

    if (!teamsByProject[project.id]) {
        teamsByProject[project.id] = [];
    }

    localStorage.setItem(
        "teamsByProject",
        JSON.stringify(teamsByProject)
    );

    // Keep old storage key compatible
    localStorage.setItem("team", JSON.stringify([]));

    window.location.href = "matches.html";
});