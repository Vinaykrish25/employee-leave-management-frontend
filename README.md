
```markdown
# Employee Leave Management System – Frontend

🔗 **Live Demo:** [Notes App](https://employee-leave-management-frontend.vercel.app/login)

This is the **frontend** of the Employee Leave Management System developed using **React.js**, **Material UI (MUI)**, and **Axios**. It allows administrators and employees to manage and monitor leave requests through a responsive and role-based dashboard.

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or above)
- **npm** (comes with Node.js)

---

## 📁 Folder Structure

```

frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminDepartments.jsx
│   │   │   ├── AdminEmployees.jsx
│   │   │   ├── AdminLeaveApplications.jsx
│   │   │   ├── AdminLeaveTypes.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── Employee/
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ApplyLeave.jsx
│   │   │   ├── LeaveHistory.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   └── ChangePassword.jsx
│   │   └── Common/
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── EmployeeLogin.jsx
│   │   ├── RegisterEmployee.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.js
│   ├── index.js
│   └── App.css
│
├── .env
├── .gitignore
└── package.json

````

---

## 🧠 Features

✅ **Role-based dashboards**  
✅ **Admin functionalities**:
  - Manage departments (add/edit/delete)
  - Manage employees
  - Manage leave types
  - View and take action on leave applications  
✅ **Employee functionalities**:
  - Apply for leave
  - Track leave history
  - View and update profile
  - Change password  
✅ **JWT-based authentication**  
✅ **Responsive Material UI interface**  
✅ **Search, sort, and pagination for tables**  
✅ **Export to PDF and Excel**  
✅ **Snackbars and Dialogs for user feedback**

---

## ⚙️ Environment Setup

Create a `.env` file in the root of the `frontend/` folder and add:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/
````

Make sure the backend server is running at the specified base URL.

---

## 🛠️ Installation & Running the App

1. Clone the repository:

```bash
git clone https://github.com/your-username/employee-leave-management-frontend.git
cd employee-leave-management-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

> App will be available at: `http://localhost:3000`

---

## 🔒 Authentication

* JWT token is stored in `localStorage` upon login.
* Protected routes restrict access based on role.
* Authorization headers are included in every API request via Axios.

---

## 🤝 Contributing

Pull requests are welcome. Please follow proper coding conventions and structure when contributing.

---

## 📘 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by \[Vinaykrishna]

```
