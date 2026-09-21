const form = document.getElementById("profileForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

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

    localStorage.setItem("studentProfile", JSON.stringify(profile));

    let registeredStudents =
        JSON.parse(localStorage.getItem("registeredStudents")) || [];

    const existingIndex = registeredStudents.findIndex(
        student =>
            student.email.toLowerCase() === profile.email.toLowerCase()
    );

    if (existingIndex !== -1) {
        registeredStudents[existingIndex] = profile;
    } else {
        registeredStudents.push(profile);
    }

    localStorage.setItem(
        "registeredStudents",
        JSON.stringify(registeredStudents)
    );

    alert("Profile saved successfully!");
    window.location.href = "project.html";
});
