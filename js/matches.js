// ============================================================
// SMART TEAM MATCHER - MATCHES PAGE
// ============================================================

// Get HTML elements
const matchesContainer = document.getElementById("matches");
const projectInfo = document.getElementById("projectInfo");


// ============================================================
// GET PROJECTS
// ============================================================

let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

// Support old project storage
if (
    projects.length === 0 &&
    localStorage.getItem("project")
) {
    const oldProject =
        JSON.parse(localStorage.getItem("project"));

    if (oldProject) {
        projects = [oldProject];
        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );
    }
}


// ============================================================
// ACTIVE PROJECT
// ============================================================

let activeProjectId =
    localStorage.getItem("activeProjectId");

let project = null;

if (projects.length > 0) {

    if (activeProjectId) {

        project = projects.find(
            p =>
                String(p.id || p.projectId) ===
                String(activeProjectId)
        );
    }

    // If active project not found
    if (!project) {
        project = projects[0];

        localStorage.setItem(
            "activeProjectId",
            String(project.id || project.projectId)
        );
    }
}


// ============================================================
// CURRENT USER PROFILE
// ============================================================

const currentProfile =
    JSON.parse(
        localStorage.getItem("studentProfile")
    );


// ============================================================
// INITIAL PAGE LOAD
// ============================================================

if (!project) {

    projectInfo.innerHTML = `
        <div class="empty-state">
            <h3>No Project Found</h3>
            <p>
                Create a project first to find suitable teammates.
            </p>

            <a href="project.html"
               class="primary-btn">
                Create Project
            </a>
        </div>
    `;

    matchesContainer.innerHTML = `
        <div class="empty-state">
            <h3>Create a Project First</h3>
            <p>
                Once you create a project,
                recommended teammates will appear here.
            </p>
        </div>
    `;

} else {

    displayProjectHistory();
    displayProject();
    displayMatches();
}


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();
}


// ============================================================
// GET ALL STUDENTS
// ============================================================

function getAllStudentsForMatching() {

    // --------------------------------------------------------
    // Students already present in data.js
    // --------------------------------------------------------

    const existingStudents =
        typeof students !== "undefined"
            ? students
            : [];


    // --------------------------------------------------------
    // Students created through Profile page
    // --------------------------------------------------------

    let registeredStudents = [];

    try {

        registeredStudents =
            JSON.parse(
                localStorage.getItem(
                    "registeredStudents"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Error reading registeredStudents:",
            error
        );

        registeredStudents = [];
    }


    // Make sure it is an array
    if (!Array.isArray(registeredStudents)) {

        registeredStudents = [];
    }


    // --------------------------------------------------------
    // Combine data.js students + registered students
    // --------------------------------------------------------

    const combinedStudents = [
        ...existingStudents,
        ...registeredStudents
    ];


    // --------------------------------------------------------
    // Remove duplicate students using email
    // --------------------------------------------------------

    const uniqueStudents = [];

    const seenEmails = new Set();

    combinedStudents.forEach(student => {

        if (!student) {
            return;
        }

        const email =
            normalize(student.email);


        // If email already exists,
        // don't add duplicate
        if (
            email &&
            seenEmails.has(email)
        ) {
            return;
        }


        if (email) {
            seenEmails.add(email);
        }


        uniqueStudents.push(student);
    });


    return uniqueStudents;
}


// ============================================================
// DISPLAY PROJECT HISTORY
// ============================================================

function displayProjectHistory() {

    if (!projectInfo || projects.length <= 1) {
        return;
    }


    const historyHTML = `
        <div class="project-history">

            <h3>Your Projects</h3>

            <div class="project-list">

                ${projects.map((p, index) => {

                    const id =
                        p.id ||
                        p.projectId ||
                        index;

                    const projectName =
                        p.projectName ||
                        p.name ||
                        "Untitled Project";

                    const active =
                        String(
                            id
                        ) ===
                        String(
                            project.id ||
                            project.projectId
                        );

                    return `
                        <button
                            class="project-history-item
                            ${active ? "active" : ""}"
                            onclick="selectProject('${id}')">

                            ${projectName}

                        </button>
                    `;

                }).join("")}

            </div>

        </div>
    `;


    projectInfo.insertAdjacentHTML(
        "beforebegin",
        historyHTML
    );
}


// ============================================================
// SELECT PROJECT
// ============================================================

function selectProject(projectId) {

    const selectedProject =
        projects.find(
            p =>
                String(
                    p.id ||
                    p.projectId
                ) ===
                String(projectId)
        );


    if (!selectedProject) {
        return;
    }


    localStorage.setItem(
        "activeProjectId",
        String(
            selectedProject.id ||
            selectedProject.projectId
        )
    );


    window.location.reload();
}


// ============================================================
// DISPLAY CURRENT PROJECT
// ============================================================

function displayProject() {

    if (!projectInfo || !project) {
        return;
    }


    const projectName =
        project.projectName ||
        project.name ||
        "Untitled Project";


    const description =
        project.description ||
        "No description available.";


    const requiredSkills =
        Array.isArray(
            project.requiredSkills
        )
            ? project.requiredSkills
            : String(
                project.requiredSkills || ""
            )
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);


    const teamSize =
        project.teamSize ||
        "Not specified";


    projectInfo.innerHTML = `

        <div class="project-details">

            <div class="project-detail-item">

                <span class="detail-label">
                    Project Name
                </span>

                <strong>
                    ${projectName}
                </strong>

            </div>


            <div class="project-detail-item">

                <span class="detail-label">
                    Description
                </span>

                <strong>
                    ${description}
                </strong>

            </div>


            <div class="project-detail-item">

                <span class="detail-label">
                    Required Skills
                </span>

                <div class="skill-tags">

                    ${
                        requiredSkills.length > 0
                            ? requiredSkills
                                .map(
                                    skill =>
                                        `<span class="skill-tag">
                                            ${skill}
                                        </span>`
                                )
                                .join("")
                            : `<span>No skills specified</span>`
                    }

                </div>

            </div>


            <div class="project-detail-item">

                <span class="detail-label">
                    Team Size
                </span>

                <strong>
                    ${teamSize}
                </strong>

            </div>

        </div>

    `;
}


// ============================================================
// CALCULATE SKILL SCORE
// ============================================================

function calculateSkillScore(
    studentSkills,
    requiredSkills
) {

    if (
        !Array.isArray(studentSkills) ||
        !Array.isArray(requiredSkills) ||
        requiredSkills.length === 0
    ) {
        return 0;
    }


    const studentSkillNames =
        studentSkills.map(normalize);


    const requiredSkillNames =
        requiredSkills.map(normalize);


    let matchedSkills = 0;


    requiredSkillNames.forEach(skill => {

        if (
            studentSkillNames.includes(skill)
        ) {
            matchedSkills++;
        }

    });


    return Math.round(
        (
            matchedSkills /
            requiredSkillNames.length
        ) * 100
    );
}


// ============================================================
// CALCULATE INTEREST SCORE
// ============================================================

function calculateInterestScore(
    studentInterests,
    projectInterests
) {

    if (
        !Array.isArray(studentInterests) ||
        !Array.isArray(projectInterests) ||
        projectInterests.length === 0
    ) {
        return 0;
    }


    const interests =
        studentInterests.map(normalize);


    const requiredInterests =
        projectInterests.map(normalize);


    let matched = 0;


    requiredInterests.forEach(interest => {

        if (
            interests.includes(interest)
        ) {
            matched++;
        }

    });


    return Math.round(
        (
            matched /
            requiredInterests.length
        ) * 100
    );
}


// ============================================================
// EXPERIENCE SCORE
// ============================================================

function calculateExperienceScore(
    experience
) {

    const value =
        normalize(experience);


    if (value === "advanced") {
        return 100;
    }

    if (value === "intermediate") {
        return 70;
    }

    if (value === "beginner") {
        return 40;
    }


    return 0;
}


// ============================================================
// ROLE SCORE
// ============================================================

function calculateRoleScore(
    role,
    requiredRoles
) {

    if (
        !role ||
        !Array.isArray(requiredRoles) ||
        requiredRoles.length === 0
    ) {
        return 0;
    }


    const studentRole =
        normalize(role);


    const roles =
        requiredRoles.map(normalize);


    return roles.includes(studentRole)
        ? 100
        : 0;
}


// ============================================================
// AVAILABILITY SCORE
// ============================================================

function calculateAvailabilityScore(
    availability
) {

    const value =
        normalize(availability);


    if (value === "high") {
        return 100;
    }

    if (value === "medium") {
        return 70;
    }

    if (value === "low") {
        return 40;
    }


    return 0;
}


// ============================================================
// CALCULATE MATCH SCORE
// ============================================================

function calculateMatch(student) {

    const requiredSkills =
        Array.isArray(
            project.requiredSkills
        )
            ? project.requiredSkills
            : String(
                project.requiredSkills || ""
            )
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);


    const skillScore =
        calculateSkillScore(
            student.skills || [],
            requiredSkills
        );


    // Project interests if available
    const projectInterests =
        Array.isArray(
            project.interests
        )
            ? project.interests
            : [];


    const interestScore =
        calculateInterestScore(
            student.interests || [],
            projectInterests
        );


    const experienceScore =
        calculateExperienceScore(
            student.experience
        );


    const requiredRoles =
        Array.isArray(
            project.roles
        )
            ? project.roles
            : [];


    const roleScore =
        calculateRoleScore(
            student.role,
            requiredRoles
        );


    const availabilityScore =
        calculateAvailabilityScore(
            student.availability
        );


    // Final weighted score
    const totalScore =
        Math.round(
            skillScore * 0.50 +
            interestScore * 0.20 +
            experienceScore * 0.15 +
            roleScore * 0.10 +
            availabilityScore * 0.05
        );


    return {

        total: totalScore,

        skills: skillScore,

        interests: interestScore,

        experience: experienceScore,

        role: roleScore,

        availability: availabilityScore

    };
}


// ============================================================
// DISPLAY MATCHES
// ============================================================

function displayMatches() {

    if (!matchesContainer) {
        return;
    }


    const allStudents =
        getAllStudentsForMatching();


    // --------------------------------------------------------
    // IMPORTANT:
    // Show data.js students AND newly registered students
    // --------------------------------------------------------

    const candidates =
        allStudents;


    if (candidates.length === 0) {

        matchesContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Students Available
                </h3>

                <p>
                    Add student profiles to generate
                    teammate recommendations.
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // Calculate scores
    // --------------------------------------------------------

    const scoredStudents =
        candidates.map(student => {

            const score =
                calculateMatch(student);


            return {

                student,
                score

            };

        });


    // --------------------------------------------------------
    // Sort highest score first
    // --------------------------------------------------------

    scoredStudents.sort(
        (a, b) =>
            b.score.total -
            a.score.total
    );


    // --------------------------------------------------------
    // Display cards
    // --------------------------------------------------------

    matchesContainer.innerHTML =
        scoredStudents
            .map(
                ({ student, score }) =>
                    createMatchCard(
                        student,
                        score
                    )
            )
            .join("");
}


// ============================================================
// CREATE MATCH CARD
// ============================================================

function createMatchCard(
    student,
    score
) {

    const skills =
        Array.isArray(student.skills)
            ? student.skills
            : [];


    const interests =
        Array.isArray(student.interests)
            ? student.interests
            : [];


    return `

        <article class="match-card">

            <div class="match-card-header">

                <div>

                    <h3>
                        ${student.name || "Unknown Student"}
                    </h3>

                    <p>
                        ${student.email || "No email"}
                    </p>

                </div>


                <div class="match-score">

                    <strong>
                        ${score.total}%
                    </strong>

                    <span>
                        Match
                    </span>

                </div>

            </div>


            <div class="match-info">

                <div class="info-item">

                    <span>
                        Role
                    </span>

                    <strong>
                        ${student.role || "Not specified"}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Experience
                    </span>

                    <strong>
                        ${student.experience || "Not specified"}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Availability
                    </span>

                    <strong>
                        ${student.availability || "Not specified"}
                    </strong>

                </div>

            </div>


            <div class="match-section">

                <h4>
                    Skills
                </h4>

                <div class="skill-tags">

                    ${
                        skills.length > 0
                            ? skills
                                .map(
                                    skill =>
                                        `<span class="skill-tag">
                                            ${skill}
                                        </span>`
                                )
                                .join("")
                            : `<span>No skills listed</span>`
                    }

                </div>

            </div>


            <div class="match-section">

                <h4>
                    Interests
                </h4>

                <div class="skill-tags">

                    ${
                        interests.length > 0
                            ? interests
                                .map(
                                    interest =>
                                        `<span class="skill-tag">
                                            ${interest}
                                        </span>`
                                )
                                .join("")
                            : `<span>No interests listed</span>`
                    }

                </div>

            </div>


            <div class="score-breakdown">

                <h4>
                    Compatibility Breakdown
                </h4>

                <div class="score-row">

                    <span>
                        Skills
                    </span>

                    <strong>
                        ${score.skills}%
                    </strong>

                </div>


                <div class="score-row">

                    <span>
                        Interests
                    </span>

                    <strong>
                        ${score.interests}%
                    </strong>

                </div>


                <div class="score-row">

                    <span>
                        Experience
                    </span>

                    <strong>
                        ${score.experience}%
                    </strong>

                </div>


                <div class="score-row">

                    <span>
                        Role
                    </span>

                    <strong>
                        ${score.role}%
                    </strong>

                </div>


                <div class="score-row">

                    <span>
                        Availability
                    </span>

                    <strong>
                        ${score.availability}%
                    </strong>

                </div>

            </div>


            <button
                class="invite-btn"
                onclick='inviteStudent(${JSON.stringify(student)})'>

                Invite to Team

            </button>

        </article>

    `;
}


// ============================================================
// INVITE STUDENT
// ============================================================

function inviteStudent(student) {

    if (!project) {

        alert(
            "Please create a project first."
        );

        return;
    }


    // --------------------------------------------------------
    // Get teams
    // --------------------------------------------------------

    let teamsByProject =
        JSON.parse(
            localStorage.getItem(
                "teamsByProject"
            )
        ) || {};


    const projectId =
        String(
            project.id ||
            project.projectId
        );


    if (!teamsByProject[projectId]) {

        teamsByProject[projectId] = [];
    }


    const currentTeam =
        teamsByProject[projectId];


    // --------------------------------------------------------
    // Check duplicate member
    // --------------------------------------------------------

    const alreadyAdded =
        currentTeam.some(
            member =>
                normalize(member.email) ===
                normalize(student.email)
        );


    if (alreadyAdded) {

        alert(
            `${student.name} is already in your team.`
        );

        return;
    }


    // --------------------------------------------------------
    // Check team size
    // --------------------------------------------------------

    const maxTeamSize =
        Number(
            project.teamSize
        ) || 8;


    if (
        currentTeam.length >=
        maxTeamSize
    ) {

        alert(
            `Team size limit is ${maxTeamSize} members.`
        );

        return;
    }


    // --------------------------------------------------------
    // Add student
    // --------------------------------------------------------

    currentTeam.push(student);


    teamsByProject[projectId] =
        currentTeam;


    localStorage.setItem(
        "teamsByProject",
        JSON.stringify(
            teamsByProject
        )
    );


    // --------------------------------------------------------
    // Save compatibility/team data
    // --------------------------------------------------------

    const compatibilityTeam =
        JSON.parse(
            localStorage.getItem(
                "team"
            )
        ) || [];


    const alreadyInCompatibilityTeam =
        compatibilityTeam.some(
            member =>
                normalize(member.email) ===
                normalize(student.email)
        );


    if (
        !alreadyInCompatibilityTeam
    ) {

        compatibilityTeam.push(student);

        localStorage.setItem(
            "team",
            JSON.stringify(
                compatibilityTeam
            )
        );
    }


    alert(
        `${student.name} has been added to your team!`
    );
}