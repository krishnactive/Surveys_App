# SurveysApp – Full‑Stack Survey Application

SurveysApp is a full‑stack web application for creating, sharing, and analyzing polls. It consists of a **Node.js/Express** backend and a **React (Vite)** frontend. Registered users can create polls of various types, vote or submit responses, bookmark interesting polls, and export poll results to CSV or JSON. Authentication uses **JWT** tokens and optional **Google OAuth**; profile images and poll images are stored in **Cloudinary**.

---

## Features

### User Registration & Login
- Sign up with full name, username, email and password; optional profile image upload. Credentials are hashed using **bcrypt** before saving in MongoDB.
- Login with email/password or via **Google OAuth**. Successful authentication returns a JWT token to the frontend.

### Poll Creation
- Create surveys with a question and choose a poll type such as **single‑choice** or **image‑based**.
- Add text options for single‑choice polls or upload images for image‑based polls; images are uploaded to **Cloudinary** and stored in the database.
- Form validation ensures at least **two options** for multi‑choice polls.

### Voting & Responses
- Users can vote on polls; the system prevents **multiple votes** from the same user by tracking voter IDs in the poll document.
- For open‑ended polls, responses are stored with the voter’s ID and **timestamp**.

### Poll Management
- View all polls with **infinite scrolling** and filter by poll type; see polls you created, voted in or bookmarked.
- **Bookmark** polls for quick access, or **close** your own poll when voting should stop.
- **Delete** a poll you created if needed.
- **Download** poll results as **CSV** or **JSON** via the backend endpoint.

### Statistics
- The backend counts polls a user created, polls they’ve voted in, and polls they’ve bookmarked when returning user info.

### Secure Backend
- **Express** server with **CORS** configured for specific origins and credentials.
- **JWT authentication** middleware protects poll endpoints and attaches the current user to the request.
- Environment‑driven configuration for database connection, session secret and third‑party keys.

### Modern Frontend
- Built with **React 19** and **Vite**; uses **Tailwind CSS** for styling and **React Router** for navigation.
- **Context API** manages user state, including token persistence and poll statistics.
- Components for forms, poll cards, option inputs and layout provide a clean, responsive UI.
- **Infinite scroll** and **filter controls** help users explore polls efficiently.

---

## Tech Stack

| Layer    | Technologies |
|---------:|--------------|
| Backend  | Node.js, Express, MongoDB with Mongoose, JWT, Passport Google OAuth, Cloudinary, bcrypt, Multer, ExcelJS |
| Frontend | React 19, Vite, Tailwind CSS, React Router DOM, Axios, React Hot Toast, Pdf Parse, Xlsx |
| Tools    | JSON2CSV and ExcelJS for exporting poll results; Express Session for Google OAuth sessions |

---

## Architecture

```
Surveys_App/
├── backend/
│   ├── config/        # database, Cloudinary and Passport configuration
│   ├── controllers/   # business logic for authentication, polls and exporting results
│   ├── middleware/    # JWT authentication and file‑upload middleware
│   ├── models/        # Mongoose schemas for User and Poll
│   ├── routes/        # Express route definitions for auth, polls and downloads
│   ├── uploads/       # uploaded files temporarily stored by Multer
│   ├── package.json   # backend dependencies and scripts
│   └── server.js      # entry point: sets up Express, CORS, sessions and routes
└── frontend/
    └── SurveyNow/
        ├── src/
        │   ├── pages/           # React pages (auth and dashboard)
        │   ├── components/      # shared UI components
        │   ├── context/         # React Context providers (UserContext)
        │   ├── hooks/           # custom hooks such as useUserAuth
        │   ├── utils/           # API paths, Axios instance and helpers
        │   └── index.css        # Tailwind CSS imports
        ├── package.json         # frontend dependencies and scripts
        └── vite.config.js       # Vite configuration
```

---

## Prerequisites

- Node.js and npm installed locally.
- MongoDB instance (local or cloud) accessible to the backend.
- Accounts/keys for **Cloudinary** and **Google OAuth** (for profile and poll image uploads and Google login).

---

## Installation

### Clone the repository

```bash
git clone https://github.com/krishnactive/Surveys_App.git
cd Surveys_App
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in **backend** and define the following variables:

```
PORT=5000
MONGO_URL=<your MongoDB connection string>
JWT_SECRET=<random secret string for JWT>
SESSION_SECRET=<random secret string for Express sessions>
CLIENT_URL=http://localhost:5173        # URL of the frontend (for CORS)
CLOUDINARY_CLOUD_NAME=<cloudinary cloud name>
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
```

Start the development server (with nodemon):

```bash
npm run dev
```

The server will connect to MongoDB and start listening on the configured **PORT**.

### Frontend Setup

```bash
cd ../frontend/SurveyNow
npm install
```

Create a `.env` file in **frontend/SurveyNow** with a `VITE_BASE_URL` variable pointing to your backend:

```
VITE_BASE_URL=http://localhost:5000
```

Run the development server:

```bash
npm run dev
```

Vite will start the React application on port **5173** (by default), which proxies API calls to the backend using the `VITE_BASE_URL`.

---
## API Overview

The backend exposes RESTful endpoints under the `/api/v1` prefix. Most poll routes are protected and require a valid JWT token in the `Authorization: Bearer <token>` header.

### Auth

- **POST** `/api/v1/auth/register` – Register a new user. Requires `fullName`, `username`, `email`, `password`; returns a JWT token.
- **POST** `/api/v1/auth/login` – Login with email and password; returns token and user stats.
- **GET** `/api/v1/auth/getUser` – Get current user info and statistics (requires JWT).
- **POST** `/api/v1/auth/upload-image` – Upload an image to Cloudinary (e.g., profile pictures).
- **GET** `/api/v1/auth/google` – Initiate Google OAuth login.
- **GET** `/api/v1/auth/google/callback` – Google OAuth callback; creates or finds a user and returns a JWT.

### Polls

- **POST** `/api/v1/poll/create` – Create a poll. Body requires `question`, `type`, and `options`; creator is taken from JWT. Supports single‑choice and image‑based polls.
- **GET** `/api/v1/poll/getAllPolls` – Get all polls with optional `page`, `limit`, `type`, and `creatorId` query parameters.
- **GET** `/api/v1/poll/votedPolls` – Get polls that the authenticated user has voted on.
- **GET** `/api/v1/poll/user/bookmarked` – Get polls the user has bookmarked.
- **GET** `/api/v1/poll/:id` – Get a single poll by ID, including its options and current vote counts.
- **POST** `/api/v1/poll/:id/vote` – Vote on a poll. Accepts `optionIndex` or `responseText` depending on poll type; prevents duplicate votes using the `voters` array.
- **POST** `/api/v1/poll/:id/close` – Close a poll (creator only).
- **POST** `/api/v1/poll/:id/bookmark` – Bookmark or remove bookmark on a poll for the current user.
- **DELETE** `/api/v1/poll/:id/delete` – Delete a poll (creator only).

### Download

- **GET** `/api/v1/poll/:id/download` – Export poll results to **CSV** (default) or **JSON**. Accepts a `format` query parameter (`csv`/`json`).

## Contributing

1. Fork the repository and create a new branch for your feature or bug fix.
2. Make your changes and commit them with clear messages.
3. Push to your fork and open a pull request.

Please ensure that new or changed features are covered by appropriate tests and that the application builds successfully.



## Author

**Name:** Krishna Kant Sharma  
**Email:** krishnactive@gmail.com  
**GitHub:** [krishnactive](https://github.com/krishnactive)  
**LinkedIn:** [Krishna Kant Sharma](https://www.linkedin.com/in/krishna-kant-sharma-a64955230/)


---
