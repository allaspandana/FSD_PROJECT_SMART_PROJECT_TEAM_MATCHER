/* =========================================================
   TEAM PAGE - PROJECT AND TEAM MANAGEMENT
   ========================================================= */


/* =========================================================
   GET PROJECTS
   ========================================================= */

function getProjects() {

    let projects = JSON.parse(
        localStorage.getItem("projects") || "[]"
    );

    return Array.isArray(projects) ? projects : [];
}


/* =========================================================
   SAVE PROJECTS
   ========================================================= */

function saveProjects(projects) {

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );
}


/* =========================================================
   GET PROJECT ID
   ========================================================= */

function getProjectId(project, index) {

    /*
       First preference:
       project.id

       If id is not available:
       project.projectId

       If both are not available:
       use index as fallback
    */

    if (project.id !== undefined && project.id !== null) {
        return String(project.id);
    }

    if (
        project.projectId !== undefined &&
        project.projectId !== null
    ) {
        return String(project.projectId);
    }

    return String(index);
}


/* =========================================================
   GET TEAMS BY PROJECT
   ========================================================= */

function getTeamsByProject() {

    let teams = JSON.parse(
        localStorage.getItem("teamsByProject") || "{}"
    );

    if (
        typeof teams !== "object" ||
        Array.isArray(teams) ||
        teams === null
    ) {
        teams = {};
    }

    return teams;
}


/* =========================================================
   SAVE TEAMS BY PROJECT
   ========================================================= */

function saveTeamsByProject(teams) {

    localStorage.setItem(
        "teamsByProject",
        JSON.stringify(teams)
    );
}


/* =========================================================
   DISPLAY TEAM PAGE
   ========================================================= */

function displayTeam() {

    const projects = getProjects();

    const teamsByProject = getTeamsByProject();

    const summaryContainer =
        document.getElementById("teamSummary");

    const projectsContainer =
        document.getElementById("teamMembers");


    /* -----------------------------------------
       TOTAL TEAM MEMBERS
       ----------------------------------------- */

    let totalMembers = 0;

    projects.forEach(function(project, index) {

        const projectId =
            getProjectId(project, index);

        const team =
            teamsByProject[projectId] || [];

        totalMembers += team.length;

    });


    /* -----------------------------------------
       SUMMARY
       ----------------------------------------- */

    summaryContainer.innerHTML = `

        <div class="summary-card">

            <div class="summary-title">
                TOTAL PROJECTS
            </div>

            <div class="summary-value">
                ${projects.length}
            </div>

        </div>


        <div class="summary-card">

            <div class="summary-title">
                TOTAL TEAM MEMBERS
            </div>

            <div class="summary-value">
                ${totalMembers}
            </div>

        </div>

    `;


    /* -----------------------------------------
       NO PROJECTS
       ----------------------------------------- */

    if (projects.length === 0) {

        projectsContainer.innerHTML = `

            <div class="no-projects">

                <h3>
                    No Projects Found
                </h3>

                <p>
                    You have not created any projects yet.
                </p>

            </div>

        `;

        return;
    }


    /* -----------------------------------------
       DISPLAY PROJECTS
       ----------------------------------------- */

    projectsContainer.innerHTML = "";


    projects.forEach(function(project, index) {

        const projectId =
            getProjectId(project, index);

        const team =
            teamsByProject[projectId] || [];


        const projectName =
            project.name ||
            project.title ||
            "Untitled Project";


        const projectDescription =
            project.description ||
            "No project description available.";


        let membersHTML = "";


        /* -----------------------------------------
           TEAM MEMBERS
           ----------------------------------------- */

        if (team.length > 0) {

            team.forEach(function(member, memberIndex) {

                const memberName =
                    member.name ||
                    member.studentName ||
                    member.username ||
                    "Unknown Student";


                const memberEmail =
                    member.email ||
                    member.studentEmail ||
                    "No email available";


                const memberRole =
                    member.role ||
                    member.skills ||
                    "Team Member";


                const initials =
                    getInitials(memberName);


                membersHTML += `

                    <div class="member-row">

                        <div class="member-avatar">
                            ${initials}
                        </div>


                        <div class="member-info">

                            <div class="member-name">
                                ${escapeHtml(memberName)}
                            </div>

                            <div class="member-email">
                                ${escapeHtml(memberEmail)}
                            </div>

                            <span class="member-role">
                                ${escapeHtml(String(memberRole))}
                            </span>

                        </div>


                        <button
                            class="remove-member-btn"
                            onclick="removeTeamMember('${escapeHtml(projectId)}', ${memberIndex})"
                        >
                            Remove
                        </button>

                    </div>

                `;

            });

        }


        /* -----------------------------------------
           EMPTY TEAM MESSAGE
           ----------------------------------------- */

        else {

            membersHTML = `

                <div class="empty-team">

                    <p>
                        No team members have been added to this project yet.
                    </p>

                    <button
                        class="find-members-btn"
                        onclick="openMatches('${escapeHtml(projectId)}')"
                    >
                        Find Teammates
                    </button>

                </div>

            `;

        }


        /* -----------------------------------------
           PROJECT CARD
           ----------------------------------------- */

        const projectCard = document.createElement("div");

        projectCard.className =
            "project-team-card";


        projectCard.innerHTML = `

            <div class="project-top">


                <div class="project-details">

                    <div class="project-number">
                        PROJECT ${index + 1}
                    </div>


                    <div class="project-name">
                        ${escapeHtml(projectName)}
                    </div>


                    <div class="project-description">
                        ${escapeHtml(projectDescription)}
                    </div>

                </div>


                <div class="team-size">

                    <span class="team-size-number">
                        ${team.length}
                    </span>

                    <span class="team-size-text">
                        / ${project.teamSize || 3} members
                    </span>

                </div>


            </div>


            <div class="project-actions">

                <button
                    class="project-action-btn matches-btn"
                    onclick="openMatches('${escapeHtml(projectId)}')"
                >
                    Find Teammates
                </button>


                <button
                    class="project-action-btn delete-project-btn"
                    onclick="deleteProject('${escapeHtml(projectId)}')"
                >
                    Delete Project
                </button>

            </div>


            <div class="members-section">

                <div class="members-heading">

                    <h3>
                        Team Members
                    </h3>

                    <span>
                        ${team.length} members
                    </span>

                </div>


                <div class="member-list">

                    ${membersHTML}

                </div>

            </div>

        `;


        projectsContainer.appendChild(projectCard);

    });

}


/* =========================================================
   REMOVE INDIVIDUAL TEAM MEMBER
   ========================================================= */

function removeTeamMember(projectId, memberIndex) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this team member?"
        );


    if (!confirmed) {
        return;
    }


    const teamsByProject =
        getTeamsByProject();


    const team =
        teamsByProject[projectId] || [];


    /* -----------------------------------------
       CHECK MEMBER
       ----------------------------------------- */

    if (
        memberIndex < 0 ||
        memberIndex >= team.length
    ) {

        alert("Team member not found.");

        return;
    }


    /* -----------------------------------------
       REMOVE ONLY SELECTED MEMBER
       ----------------------------------------- */

    team.splice(memberIndex, 1);


    /* -----------------------------------------
       SAVE UPDATED TEAM
       ----------------------------------------- */

    teamsByProject[projectId] = team;

    saveTeamsByProject(teamsByProject);


    /* -----------------------------------------
       REFRESH PAGE
       ----------------------------------------- */

    displayTeam();

}


/* =========================================================
   DELETE COMPLETE PROJECT
   ========================================================= */

function deleteProject(projectId) {

    const projects =
        getProjects();


    /* -----------------------------------------
       FIND PROJECT
       ----------------------------------------- */

    const projectIndex =
        projects.findIndex(function(project, index) {

            return getProjectId(project, index) ===
                String(projectId);

        });


    /* -----------------------------------------
       PROJECT NOT FOUND
       ----------------------------------------- */

    if (projectIndex === -1) {

        alert(
            "Project could not be found."
        );

        return;
    }


    const project =
        projects[projectIndex];


    const projectName =
        project.name ||
        project.title ||
        "this project";


    /* -----------------------------------------
       CONFIRM DELETE
       ----------------------------------------- */

    const confirmed =
        confirm(
            "Are you sure you want to delete \"" +
            projectName +
            "\"?\n\n" +
            "This will delete the project and all team members associated with it."
        );


    if (!confirmed) {
        return;
    }


    /* -----------------------------------------
       DELETE PROJECT
       ----------------------------------------- */

    projects.splice(
        projectIndex,
        1
    );


    /* -----------------------------------------
       SAVE UPDATED PROJECTS
       ----------------------------------------- */

    saveProjects(projects);


    /* -----------------------------------------
       DELETE PROJECT TEAM
       ----------------------------------------- */

    const teamsByProject =
        getTeamsByProject();


    delete teamsByProject[String(projectId)];


    saveTeamsByProject(
        teamsByProject
    );


    /* -----------------------------------------
       UPDATE ACTIVE PROJECT
       ----------------------------------------- */

    const activeProject =
        JSON.parse(
            localStorage.getItem("activeProject") ||
            "null"
        );


    if (
        activeProject &&
        String(
            activeProject.id ||
            activeProject.projectId
        ) === String(projectId)
    ) {

        if (projects.length > 0) {

            localStorage.setItem(
                "activeProject",
                JSON.stringify(projects[0])
            );

        } else {

            localStorage.removeItem(
                "activeProject"
            );

        }

    }


    /* -----------------------------------------
       REFRESH TEAM PAGE
       ----------------------------------------- */

    displayTeam();

}


/* =========================================================
   OPEN MATCHES PAGE
   ========================================================= */

function openMatches(projectId) {

    localStorage.setItem(
        "activeProjectId",
        String(projectId)
    );


    window.location.href =
        "matches.html";

}


/* =========================================================
   GET INITIALS
   ========================================================= */

function getInitials(name) {

    if (!name) {
        return "U";
    }


    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayTeam();

    }
);