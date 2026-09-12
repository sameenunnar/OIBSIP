# 🚀 OIBSIP — Web Development Projects

> A collection of web development projects including a Calculator, Full-Stack Login Authentication System, To-Do Web App, and Tribute Page.

---

# 📂 Projects

This repository contains the following projects:

* 🧮 Calculator
* 🔐 Login Authentication System
* ✅ To-Do Web App
* 🏛️ Tribute Page — Ada Lovelace

---

# 🧮 01 — Calculator

**Folder:** `WebDev-L2-Calculator`

A fully functional browser-based calculator built with HTML5, CSS3, and vanilla JavaScript.

## ✨ Features

* Display screen showing the running expression and current input/result
* Digit buttons from `0–9`
* Decimal point support
* Addition
* Subtraction
* Multiplication
* Division
* Equals button for calculations
* Clear button to reset the calculator
* Backspace button to delete the last character
* Division-by-zero protection
* Operator chaining
* Percentage calculation
* Keyboard support
* Responsive button layout using CSS Grid
* Event handling using `addEventListener`
* No inline `onclick`
* No use of `eval()`

## 🛠️ Technologies

* HTML5
* CSS3
* JavaScript (Vanilla ES6+)
* CSS Grid
* CSS Variables
* IBM Plex Mono font

## ▶️ How to Run

1. Open the project folder:

```bash
cd WebDev-L2-Calculator  
```

2. Open `index.html` in a modern browser.

No server, dependencies, or build process is required.

---

# 🔐 02 — Login Authentication System

**Folder:** `LoginAuthentication`

A full-stack authentication application with a Node.js, Express, and MongoDB backend and a React frontend built using Vite and Tailwind CSS.

The application includes registration, login, logout, JWT authentication, refresh tokens, password hashing, and a protected dashboard.

## ✨ Authentication Features

### User Authentication

* User registration
* User login
* User logout
* Password hashing with `bcryptjs`
* JWT access tokens
* JWT refresh tokens
* Refresh token rotation
* Protected user profile
* Authentication middleware
* Protected dashboard route

### Security Features

* Refresh tokens stored in `httpOnly` cookies
* Access token authentication
* Silent token refresh
* Axios authentication interceptors
* Input validation
* Login rate limiting
* Security headers with Helmet
* Request logging with Morgan

### API Endpoints

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Create a new account                 |
| POST   | `/api/auth/login`    | Authenticate a user                  |
| POST   | `/api/auth/refresh`  | Get a new access token               |
| POST   | `/api/auth/logout`   | Logout and invalidate refresh token  |
| GET    | `/api/auth/profile`  | Get the authenticated user's profile |
| GET    | `/api/health`        | API health check                     |

### React Frontend Features

* Login page
* Registration page
* Client-side validation
* Error handling
* Protected routes
* `ProtectedRoute` component
* Global authentication state with `AuthContext`
* Dashboard
* Sidebar navigation
* Activity feed
* Analytics charts
* Settings
* User directory

---

## 🛠️ Technologies

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* express-validator
* Helmet
* Morgan

---

# 🗂️ Authentication Project Structure

```text
LoginAuthentication/  
│  
├── client/  
│   ├── src/  
│   │   ├── api/  
│   │   │   └── axios.js  
│   │   │  
│   │   ├── components/  
│   │   │   └── ProtectedRoute.jsx  
│   │   │  
│   │   ├── context/  
│   │   │   └── AuthContext.jsx  
│   │   │  
│   │   ├── pages/  
│   │   │   ├── Dashboard.jsx  
│   │   │   ├── Login.jsx  
│   │   │   └── Register.jsx  
│   │   │  
│   │   ├── App.jsx  
│   │   ├── main.jsx  
│   │   └── index.css  
│   │  
│   ├── .env.example  
│   ├── index.html  
│   ├── package.json  
│   ├── postcss.config.js  
│   ├── tailwind.config.js  
│   └── vite.config.js  
│  
├── server/  
│   ├── config/  
│   │   └── db.js  
│   │  
│   ├── controllers/  
│   │   └── authController.js  
│   │  
│   ├── middleware/  
│   │   └── auth.js  
│   │  
│   ├── models/  
│   │   └── User.js  
│   │  
│   ├── routes/  
│   │   └── authRoutes.js  
│   │  
│   ├── .env.example  
│   ├── package.json  
│   └── server.js  
│  
├── .gitignore  
├── LICENSE  
├── package.json  
└── README.md  
```

---

# ▶️ Running the Login Authentication System

## Install Project Dependencies

From the project folder:

```bash
cd LoginAuthentication  
```

Install dependencies:

```bash
npm install  
```

The project also contains separate `client` and `server` folders.

---

## Backend

Navigate to the server:

```bash
cd server  
```

Install dependencies:

```bash
npm install  
```

Configure environment variables using:

```text
.env.example  
```

Then start the server using the available npm scripts.

---

## Frontend

Navigate to the client:

```bash
cd client  
```

Install dependencies:

```bash
npm install  
```

Start the Vite development server:

```bash
npm run dev  
```

---

# ✅ 03 — To-Do Web App

**Folder:** `WebDev-L2-TodoWebApp`

An interactive To-Do application built with HTML5, CSS3, and vanilla JavaScript.

The application supports task management with separate Pending and Completed sections and stores tasks using browser `localStorage`.

## ✨ Features

* Add new tasks
* Press Enter to add tasks
* Pending tasks list
* Completed tasks list
* Mark tasks as complete
* Move completed tasks back to pending
* Edit tasks
* Save edited tasks
* Cancel editing with Escape
* Delete tasks
* Pending task counter
* Completed task counter
* Task timestamps
* Added time display
* Completed time display
* Empty-state messages
* Input validation
* Blank task prevention
* Task persistence with `localStorage`
* Responsive two-column layout
* Event delegation
* No inline `onclick`

## 🛠️ Technologies

* HTML5
* CSS3
* JavaScript (Vanilla ES6+)
* CSS Grid
* `localStorage`
* HTML `<template>` element

## ▶️ How to Run

1. Open the project folder:

```bash
cd WebDev-L2-TodoWebApp  
```

2. Open `index.html` in a modern browser.

No dependencies, server, or build process is required.

Tasks remain saved after refreshing the page through browser `localStorage`.

---

# 🏛️ 04 — Tribute Page

**Folder:** `WebDev-L2-TributePage`

A tribute page dedicated to **Ada Lovelace**, the mathematician whose work on Charles Babbage's Analytical Engine included what is widely recognized as the first published algorithm intended for a machine.

## ✨ Features

* Ada Lovelace hero section
* One-line tagline
* Prominent portrait presentation
* Decorative SVG portrait frame
* Biography section
* Four original biography paragraphs
* Key milestones timeline
* Timeline covering important events from 1815 to 1980
* Styled quote section
* Multiple visually distinct section backgrounds
* Responsive design
* Mobile layout support
* Portrait fallback system
* SVG fallback monogram when the image cannot load

## 🛠️ Technologies

* HTML5
* CSS3
* JavaScript
* Flexbox
* CSS Variables
* Inline SVG
* Playfair Display
* Source Sans 3

## ▶️ How to Run

1. Extract the project to a normal folder.

2. Open:

```text
WebDev-L2-TributePage/index.html  
```

You can open it directly in a browser or use a local development server such as VS Code Live Server.

No dependencies or build process are required.

---

# 🗂️ Complete Repository Structure

```text
OIBSIP/  
│  
├── WebDev-L2-Calculator/  
│   ├── index.html  
│   ├── style.css  
│   ├── script.js  
│   └── README.md  
│  
├── LoginAuthentication/  
│   ├── client/  
│   ├── server/  
│   ├── package.json  
│   ├── .gitignore  
│   ├── LICENSE  
│   └── README.md  
│  
├── WebDev-L2-TodoWebApp/  
│   ├── index.html  
│   ├── style.css  
│   ├── script.js  
│   └── README.md  
│  
├── WebDev-L2-TributePage/  
│   ├── index.html  
│   ├── style.css  
│   ├── script.js  
│   └── README.md  
│  
├── .gitattributes  
│  
└── README.md  
```

---

# 💻 Technologies Used

Across these projects, the technologies used include:

### Frontend

* HTML5
* CSS3
* JavaScript
* React
* React Router
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcryptjs
* HTTP-only cookies
* Token refresh
* Helmet
* Rate limiting
* Input validation

### Browser Features

* DOM Manipulation
* Event Listeners
* Event Delegation
* CSS Grid
* Flexbox
* CSS Variables
* Local Storage
* Keyboard Events

---

# 🚀 Getting Started

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL  
```

Open the repository:

```bash
cd OIBSIP  
```

Then select the project you want to run.

For the Calculator, Tribute Page, and To-Do Web App, simply open their `index.html` files in a browser.

For the Login Authentication project, install the required dependencies for the client and server.

---

# 📄 License

The `LoginAuthentication` project includes an MIT License.

See the project's `LICENSE` file for more information.