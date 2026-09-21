const matchesContainer = document.getElementById("matches");
const projectInfo = document.getElementById("projectInfo");

let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Migrate an older single-project record into the project history.
const legacyProject = JSON.parse(localStorage.getItem("project"));
if (projects.length === 0 && legacyProject) {
    legacyProject.id = legacyProject.id || `legacy_${Date.now()}`;
    legacyProject.createdAt = legacyProject.createdAt || new Date().toISOString();
    projects = [legacyProject];
    localStorage.setItem("projects", JSON.stringify(projects));
}

let activeProjectId = localStorage.getItem("activeProjectId") || (projects[projects.length - 1] || {}).id;
let project = projects.find(item => item.id === activeProjectId) || projects[projects.length - 1];

const currentProfile =
    JSON.parse(localStorage.getItem("studentProfile"));

if (!project) {
    projectInfo.innerHTML = `
        <div class="notice-box">
            <h3>No project created yet</h3>
            <p>Create a project first to see teammate recommendations.</p>
            <a href="project.html" class="primary-btn">Create Project</a>
        </div>
    `;

    matchesContainer.innerHTML = `
        <div class="empty-matches">
            <div class="empty-icon">📋</div>
            <h2>Create a project to start matching</h2>
            <p>Your recommendations will appear here.</p>
        </div>
    `;
} else {
    displayProjectHistory();
    displayProject();
    displayMatches();
}

function displayProjectHistory() {
    const history = document.createElement("section");
    history.className = "project-history-section";
    history.innerHTML = `
        <div class="recommendations-header">
            <span class="page-label">PROJECT HISTORY</span>
            <h2>All Your Projects</h2>
            <p>Select any project to view its requirements and teammate recommendations.</p>
        </div>
        <div class="project-history-grid">
            ${[...projects].reverse().map(item => `
                <button class="project-history-card ${item.id === project.id ? "selected" : ""}" data-project-id="${item.id}">
                    <span class="history-status">${item.id === project.id ? "ACTIVE PROJECT" : "PROJECT"}</span>
                    <h3>${escapeHtml(item.projectName)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                    <span class="history-meta">Team size: ${item.teamSize} · ${item.requiredSkills.length} skills</span>
                </button>
            `).join("")}
        </div>
    `;

    const main = document.querySelector("main");
    const projectCard = document.querySelector(".project-card");
    main.insertBefore(history, projectCard);

    history.querySelectorAll("[data-project-id]").forEach(button => {
        button.addEventListener("click", () => {
            activeProjectId = button.dataset.projectId;
            project = projects.find(item => item.id === activeProjectId);
            localStorage.setItem("activeProjectId", activeProjectId);
            localStorage.setItem("project", JSON.stringify(project));
            localStorage.removeItem("team");
            history.remove();
            displayProjectHistory();
            displayProject();
            displayMatches();
        });
    });
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
}

function displayProject() {
    projectInfo.innerHTML = `
        <div class="project-info-grid">
            <div>
                <span>PROJECT NAME</span>
                <strong>${project.projectName}</strong>
            </div>

            <div>
                <span>TEAM SIZE</span>
                <strong>${project.teamSize}</strong>
            </div>
        </div>

        <p class="project-description">
            ${project.description}
        </p>

        <div class="required-skills">
            <span>REQUIRED SKILLS</span>
            <div class="student-tags">
                ${project.requiredSkills
                    .map(skill => `<span class="student-skill">${skill}</span>`)
                    .join("")}
            </div>
        </div>
    `;
}

function normalize(value) {
    return (value || "").trim().toLowerCase();
}

function calculateSkillScore(student) {
    const required = project.requiredSkills || [];
    const studentSkills = student.skills || [];

    if (required.length === 0) return 100;

    let matched = 0;

    required.forEach(requiredSkill => {
        const found = studentSkills.some(
            skill => normalize(skill) === normalize(requiredSkill)
        );

        if (found) matched++;
    });

    return (matched / required.length) * 100;
}

function calculateInterestScore(student) {
    const description = normalize(project.description);
    const projectName = normalize(project.projectName);
    const interests = student.interests || [];

    if (interests.length === 0) return 0;

    let matched = 0;

    interests.forEach(interest => {
        const words = normalize(interest)
            .split(" ")
            .filter(word => word.length > 2);

        if (
            words.some(
                word =>
                    description.includes(word) ||
                    projectName.includes(word)
            )
        ) {
            matched++;
        }
    });

    if (matched === 0) {
        const required = (project.requiredSkills || []).map(normalize);

        if (
            interests.some(interest =>
                required.some(skill =>
                    normalize(interest).includes(skill) ||
                    skill.includes(normalize(interest))
                )
            )
        ) {
            return 60;
        }
    }

    return (matched / interests.length) * 100;
}

function calculateExperienceScore(student) {
    const values = {
        Beginner: 40,
        Intermediate: 70,
        Advanced: 100
    };

    return values[student.experience] || 40;
}

function calculateRoleScore(student) {
    const roleKeywords = {
        Frontend: ["html", "css", "javascript", "frontend", "web"],
        Backend: ["backend", "python", "java", "django", "spring", "api", "sql"],
        "Full Stack": ["html", "css", "javascript", "backend", "frontend"],
        "UI/UX": ["ui", "ux", "design", "frontend"],
        Database: ["sql", "mysql", "oracle", "database"],
        "AI/ML": ["ai", "ml", "machine", "python"]
    };

    const keywords = roleKeywords[student.role] || [];
    const projectText = normalize(
        `${project.projectName} ${project.description} ${(project.requiredSkills || []).join(" ")}`
    );

    if (!keywords.length) return 50;

    return keywords.some(keyword => projectText.includes(keyword))
        ? 100
        : 50;
}

function calculateAvailabilityScore(student) {
    const values = {
        High: 100,
        Medium: 70,
        Low: 40
    };

    return values[student.availability] || 40;
}

function calculateMatch(student) {
    const skills = calculateSkillScore(student);
    const interests = calculateInterestScore(student);
    const experience = calculateExperienceScore(student);
    const role = calculateRoleScore(student);
    const availability = calculateAvailabilityScore(student);

    const finalScore =
        skills * 0.50 +
        interests * 0.20 +
        experience * 0.15 +
        role * 0.10 +
        availability * 0.05;

    return {
        skills,
        interests,
        experience,
        role,
        availability,
        finalScore: Math.round(finalScore)
    };
}

function getAllStudentsForMatching() {
    const registered =
        JSON.parse(localStorage.getItem("registeredStudents")) || [];

    const combined = [...students, ...registered];

    const unique = [];
    const seenEmails = new Set();

    combined.forEach(student => {
        const email = normalize(student.email);

        if (!seenEmails.has(email)) {
            seenEmails.add(email);
            unique.push(student);
        }
    });

    return unique;
}

function displayMatches() {
    const allStudents = getAllStudentsForMatching();

    const candidates = allStudents.filter(student => {
        if (!currentProfile) return true;

        return normalize(student.email) !==
            normalize(currentProfile.email);
    });

    const ranked = candidates
        .map(student => ({
            student,
            score: calculateMatch(student)
        }))
        .sort((a, b) =>
            b.score.finalScore - a.score.finalScore
        );

    if (ranked.length === 0) {
        matchesContainer.innerHTML = `
            <div class="empty-matches">
                <div class="empty-icon">👥</div>
                <h2>No teammates available</h2>
                <p>Add more student profiles to generate recommendations.</p>
            </div>
        `;
        return;
    }

    matchesContainer.innerHTML = "";

    ranked.forEach(item => {
        const student = item.student;
        const score = item.score;

        const card = document.createElement("article");
        card.className = "match-card";

        card.innerHTML = `
            <div class="match-card-header">
                <div class="student-identity">
                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>
                        <h3>${student.name}</h3>
                        <p>${student.email}</p>
                    </div>
                </div>

                <div class="score-badge">
                    ${score.finalScore}%
                </div>
            </div>

            <div class="match-role-row">
                <span class="professional-role">
                    ${student.role}
                </span>

                <span class="availability-text">
                    ${student.availability} availability
                </span>
            </div>

            <div class="match-section">
                <h4>Skills</h4>
                <div class="student-tags">
                    ${(student.skills || [])
                        .map(skill => `<span class="student-skill">${skill}</span>`)
                        .join("")}
                </div>
            </div>

            <div class="match-section">
                <h4>Interests</h4>
                <div class="student-tags">
                    ${(student.interests || [])
                        .map(interest => `<span class="student-interest">${interest}</span>`)
                        .join("")}
                </div>
            </div>

            <div class="score-breakdown">
                <div><span>Skills</span><strong>${Math.round(score.skills)}%</strong></div>
                <div><span>Interests</span><strong>${Math.round(score.interests)}%</strong></div>
                <div><span>Experience</span><strong>${Math.round(score.experience)}%</strong></div>
                <div><span>Role</span><strong>${Math.round(score.role)}%</strong></div>
                <div><span>Availability</span><strong>${Math.round(score.availability)}%</strong></div>
            </div>

            <button
                class="invite-btn"
                onclick='inviteStudent(${JSON.stringify(student)})'>
                + Invite to Team
            </button>
        `;

        matchesContainer.appendChild(card);
    });
}

function getInitials(name) {
    if (!name) return "ST";

    const words = name.trim().split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}

function inviteStudent(student) {
    let team =
        JSON.parse(localStorage.getItem("team")) || [];

    const alreadyAdded = team.some(
        member =>
            normalize(member.email) ===
            normalize(student.email)
    );

    if (alreadyAdded) {
        alert("This student is already in your team.");
        return;
    }

    if (team.length >= Number(project.teamSize)) {
        alert(
            `Your team size is limited to ${project.teamSize} members.`
        );
        return;
    }

    team.push(student);

    localStorage.setItem(
        "team",
        JSON.stringify(team)
    );

    alert(`${student.name} added to your team!`);
}
