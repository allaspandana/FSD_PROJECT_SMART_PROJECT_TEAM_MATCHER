const form = document.getElementById("profileForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Create student profile object
    const profile = {
        id: Date.now(),

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        skills: document.getElementById("skills").value
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== ""),

        interests: document.getElementById("interests").value
            .split(",")
            .map(interest => interest.trim())
            .filter(interest => interest !== ""),

        role: document.getElementById("role").value,

        experience: document.getElementById("experience").value,

        availability: document.getElementById("availability").value
    };

    // Save current student's profile
    localStorage.setItem(
        "studentProfile",
        JSON.stringify(profile)
    );

    // Get all registered students
    let registeredStudents =
        JSON.parse(
            localStorage.getItem("registeredStudents")
        ) || [];

    // Check whether email already exists
    const existingIndex = registeredStudents.findIndex(
        student =>
            student.email &&
            student.email.toLowerCase() ===
            profile.email.toLowerCase()
    );

    // Update existing student
    if (existingIndex !== -1) {
        registeredStudents[existingIndex] = profile;
    }

    // Add new student
    else {
        registeredStudents.push(profile);
    }

    // Save all registered students
    localStorage.setItem(
        "registeredStudents",
        JSON.stringify(registeredStudents)
    );

    alert("Profile saved successfully!");

    // Move to project page
    window.location.href = "project.html";
});