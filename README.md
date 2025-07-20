# 🧑‍💼 Employee Leave Management System – Frontend

🔗 **Live Demo:** [https://employee-leave-management-frontend.vercel.app/login](https://employee-leave-management-frontend.vercel.app/login)

This is the **frontend** of the Employee Leave Management System developed using **React.js**, **Material UI (MUI)**, and **Axios**. It allows administrators and employees to manage and monitor leave requests through a responsive and role-based dashboard.

---

## 🚀 Features

- Role-based dashboards (Admin & Employee)
- Admin capabilities:
  - Manage departments
  - Manage employees
  - Manage leave types
  - View & approve/reject leave applications
- Employee capabilities:
  - Apply for leave
  - Track leave history
  - View & update profile
- JWT-based Authentication
- Material UI design
- Snackbars and Dialogs for user feedback
- Export leave data to PDF and Excel

---

## 📁 Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   ├── Employee/
│   │   └── Common/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   ├── index.js
│   └── App.css
├── .env
├── .gitignore
└── package.json
```

---

## ⚙️ Installation & Running Locally

1. Clone the repo and navigate into it:

```bash
git clone https://github.com/your-username/employee-leave-management-frontend.git
cd employee-leave-management-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/
```

4. Start the app:

```bash
npm start
```

App runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Authentication

- JWT stored in localStorage
- Authorization header attached to Axios requests
- Role-based route protection using React Router

---

## 🚀 Deployment Notes

If deploying to Vercel:

- Set `REACT_APP_API_BASE_URL` in Vercel project settings to point to the deployed backend
- Make sure backend has CORS enabled for frontend URL

---
