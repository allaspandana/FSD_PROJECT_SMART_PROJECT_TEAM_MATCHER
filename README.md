
# 🚀 Smart Team Matcher

A web-based project team formation platform that helps students discover suitable teammates based on their skills, experience, and project requirements.

The system allows users to create multiple projects, find matching students, manage project teams, and view previous project teams without losing data.

---

## 📌 Project Overview

**Smart Team Matcher** is designed to simplify the process of forming effective student project teams.

Students can create projects, specify required skills, discover suitable teammates, and manage their teams through an easy-to-use web interface.

The application supports multiple projects and preserves previously created project teams using browser localStorage.

---

## 🎯 Objectives

- Help students find suitable teammates.
- Match students based on skills and experience.
- Allow users to create and manage multiple projects.
- Preserve previous project and team information.
- Provide a professional and user-friendly interface.
- Simplify project team management.

---

## ✨ Features

### 👤 Student Profile Management
- Create and manage student profiles.
- Store student skills and experience.
- Display student availability.
- View student information.

### 📁 Project Management
- Create new projects.
- Specify project name and description.
- Add required technical skills.
- Define the required team size.
- Maintain a history of created projects.

### 🤝 Smart Team Matching
- Discover suitable teammates.
- Match students based on project requirements.
- Display student skills and experience.
- Support team member invitations.

### 👥 Team Management
- Add students to a project team.
- View current project team members.
- Display all previous project teams.
- Keep team data separated by project.
- Clear the current project's team without removing other projects.

### 🎨 Professional UI
- Responsive layout.
- Modern cards and buttons.
- Consistent color palette.
- Improved spacing and typography.
- User-friendly navigation.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic and interactivity |
| LocalStorage | Browser-based data persistence |

---

## 📂 Project Structure

```text
Smart-Team-Matcher/
│
├── index.html
├── profile.html
├── project.html
├── matches.html
├── student.html
├── team.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── project.js
│   ├── matches.js
│   ├── team.js
│   ├── profile.js
│   ├── student.js
│   └── script.js
│
└── README.md
```

*The exact JavaScript filenames may vary depending on your project files.*

---

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-team-matcher.git
```

### 2. Open the Project

Navigate to the project directory:

```bash
cd smart-team-matcher
```

### 3. Run the Website

You can open `index.html` directly in your browser.

For development, use the **Live Server extension in Visual Studio Code**.

### 4. Explore the Website

1. Open the Dashboard.
2. Create your student profile.
3. Create a new project.
4. View matching students.
5. Invite suitable teammates.
6. Open the Team page to view your teams.

---

## 💾 Data Storage

The application uses browser `localStorage` to maintain project and team information.

### Main Storage Keys

| Key | Description |
|---|---|
| `projects` | Stores all created projects |
| `project` | Stores the currently selected project |
| `teamsByProject` | Stores teams separately for each project |
| `team` | Legacy team storage for compatibility |

### Example Data Structure

```javascript
projects = [
    {
        id: "project-001",
        projectName: "Smart Campus",
        description: "Campus navigation system",
        teamSize: 4,
        requiredSkills: ["JavaScript", "React"]
    },
    {
        id: "project-002",
        projectName: "Weather App",
        description: "Weather forecasting application",
        teamSize: 3,
        requiredSkills: ["Python", "API"]
    }
];
```

Teams are associated with projects using unique project IDs.

```javascript
teamsByProject = {
    "project-001": [
        {
            name: "Student 1",
            email: "student1@example.com",
            role: "Frontend Developer"
        }
    ],

    "project-002": [
        {
            name: "Student 2",
            email: "student2@example.com",
            role: "Backend Developer"
        }
    ]
};
```

---

## 🔄 Application Workflow

```text
Start
  │
  ▼
Create Student Profile
  │
  ▼
Create Project
  │
  ▼
Save Project Information
  │
  ▼
Find Matching Students
  │
  ▼
Invite Teammates
  │
  ▼
Save Team by Project ID
  │
  ▼
View Current & Previous Teams
  │
  ▼
Manage Project Teams
```

---

## 🔐 Data Management

- Each project receives a unique ID.
- Projects are stored in an array.
- Teams are stored separately using project IDs.
- Creating a new project does not intentionally remove previous projects.
- Clearing a team is limited to the selected project.

**Note:** Data is stored locally in the browser and is not automatically synchronized across devices or users.

---

## 🎨 UI Design

The project uses a professional design approach with:

- Clean white cards.
- Blue accent colors.
- Consistent borders and shadows.
- Responsive layouts.
- Clear navigation.
- Accessible text contrast.

---

## 🔮 Future Enhancements

- User authentication and login.
- Backend database integration.
- Real-time team invitations.
- Advanced AI-based teammate recommendations.
- Team chat functionality.
- Email notifications.
- Project collaboration tools.
- Cloud-based data storage.
- Admin dashboard.



## ⭐ Acknowledgement

Thank you for exploring **Smart Team Matcher**.

If you find this project useful, consider giving the repository a star ⭐.