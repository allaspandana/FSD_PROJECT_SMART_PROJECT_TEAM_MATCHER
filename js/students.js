const studentsList = document.getElementById("studentsList");
const studentCount = document.getElementById("studentCount");
const skillCount = document.getElementById("skillCount");
const availableCount = document.getElementById("availableCount");
const searchStudent = document.getElementById("searchStudent");
const roleFilter = document.getElementById("roleFilter");
const resultText = document.getElementById("resultText");

function getAllStudents() {
    const registeredStudents =
        JSON.parse(localStorage.getItem("registeredStudents")) || [];

    const combined = [...students, ...registeredStudents];

    const uniqueStudents = [];
    const seenEmails = new Set();

    combined.forEach(student => {
        const email = (student.email || "").trim().toLowerCase();

        if (!seenEmails.has(email)) {
            seenEmails.add(email);
            uniqueStudents.push(student);
        }
    });

    return uniqueStudents;
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

function getUniqueSkills(studentData) {
    const skills = [];

    studentData.forEach(student => {
        (student.skills || []).forEach(skill => {
            const cleanSkill = skill.trim();

            if (
                cleanSkill &&
                !skills.some(
                    item =>
                        item.toLowerCase() === cleanSkill.toLowerCase()
                )
            ) {
                skills.push(cleanSkill);
            }
        });
    });

    return skills;
}

function updateStatistics(studentData) {
    studentCount.textContent = studentData.length;
    skillCount.textContent = getUniqueSkills(studentData).length;

    const available = studentData.filter(
        student =>
            (student.availability || "").toLowerCase() === "high"
    );

    availableCount.textContent = available.length;
}

function displayStudents(studentData) {
    studentsList.innerHTML = "";

    resultText.textContent =
        studentData.length === 0
            ? "No students found"
            : `Showing ${studentData.length} student${studentData.length === 1 ? "" : "s"}`;

    if (studentData.length === 0) {
        studentsList.innerHTML = `
            <div class="student-empty-state">
                <div class="empty-icon">🔍</div>
                <h2>No Students Found</h2>
                <p>Try changing your search or role filter.</p>
                <button class="clear-search-btn" onclick="clearFilters()">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }

    studentData.forEach(student => {
        const card = document.createElement("article");
        card.className = "professional-student-card";

        const skillsHTML = (student.skills || []).length
            ? student.skills
                .map(skill => `<span class="student-skill">${skill}</span>`)
                .join("")
            : `<span class="no-data">No skills added</span>`;

        const interestsHTML = (student.interests || []).length
            ? student.interests
                .map(interest => `<span class="student-interest">${interest}</span>`)
                .join("")
            : `<span class="no-data">No interests added</span>`;

        let availabilityClass = "availability-low";

        if ((student.availability || "").toLowerCase() === "high") {
            availabilityClass = "availability-high";
        } else if ((student.availability || "").toLowerCase() === "medium") {
            availabilityClass = "availability-medium";
        }

        card.innerHTML = `
            <div class="professional-student-header">
                <div class="student-identity">
                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>
                        <h3>${student.name}</h3>
                        <p>${student.email}</p>
                    </div>
                </div>

                <span class="professional-role">
                    ${student.role || "Not specified"}
                </span>
            </div>

            <div class="student-card-section">
                <div class="student-section-title">Skills</div>
                <div class="student-tags">
                    ${skillsHTML}
                </div>
            </div>

            <div class="student-card-section">
                <div class="student-section-title">Interests</div>
                <div class="student-tags">
                    ${interestsHTML}
                </div>
            </div>

            <div class="student-details">
                <div class="student-detail">
                    <span>EXPERIENCE</span>
                    <strong>${student.experience || "Not specified"}</strong>
                </div>

                <div class="student-detail">
                    <span>AVAILABILITY</span>
                    <strong class="${availabilityClass}">
                        ${student.availability || "Not specified"}
                    </strong>
                </div>
            </div>
        `;

        studentsList.appendChild(card);
    });
}

function filterStudents() {
    const searchText =
        searchStudent.value.trim().toLowerCase();

    const selectedRole = roleFilter.value;

    const filtered = getAllStudents().filter(student => {
        const name = (student.name || "").toLowerCase();
        const email = (student.email || "").toLowerCase();
        const role = (student.role || "").toLowerCase();
        const skills = (student.skills || []).join(" ").toLowerCase();
        const interests = (student.interests || []).join(" ").toLowerCase();

        const matchesSearch =
            name.includes(searchText) ||
            email.includes(searchText) ||
            role.includes(searchText) ||
            skills.includes(searchText) ||
            interests.includes(searchText);

        const matchesRole =
            selectedRole === "all" ||
            student.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    displayStudents(filtered);
}

function clearFilters() {
    searchStudent.value = "";
    roleFilter.value = "all";
    filterStudents();
}

searchStudent.addEventListener("input", filterStudents);
roleFilter.addEventListener("change", filterStudents);

const allStudents = getAllStudents();

updateStatistics(allStudents);
displayStudents(allStudents);
