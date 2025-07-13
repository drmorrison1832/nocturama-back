# Nocturama Backend

_This readme was created by GitHub Copilot and needs to be reviewed._

**Nocturama-back** is my first attemp of a fully functionnal backend for a bookstore’s website featuring an agenda.
This backend aims tp manage user accounts and articles.
It is developed _ad honorem_ and still is work in progress.
A backoffice must be build (I currently access the API using Postman), and many things are are still to finish or to improve (for example, the database schemas and collections must be costomized)..
It's React frontend is also work in progress.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Article Routes](#article-routes)
- [Validation & Security](#validation--security)
- [Contributing](#contributing)
- [License](#license)
- [To Do](#to-do)

---

## Features

- User registration, login, logout, desactivation and password change
- Token-based authentication (with plans to migrate to JWT)
- Article CRUD (create, read, update, delete)
- Article search, filtering, sorting, and pagination
- Input validation and sanitization
- Rate limiting for security
- Owner/admin logic for article editing (admin features planned)
- User permissions (user, admin, root)
- Robust error handling and logging

---

## Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **express-validator** for input validation
- **validator** for email and string sanitization
- **crypto** for password hashing
- **express-rate-limit** for rate limiting
- **helmet** for security headers

---

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/drmorrison1832/nocturama-back.git
   cd nocturama-back
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up your `.env` file:**  
    Example:

   ```
   # needed
   MONGODB_URI_LOCAL=mongodb://localhost:27017/nocturama
   # optional
   NODE_LOCAL=true
   PORT=3200
   # not implemented yet
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   ```

4. **Start the server:**
   ```sh
   npm run dev
   ```

---

## API Endpoints

### User Routes

| Method | Endpoint          | Description               | Auth Required |
| ------ | ----------------- | ------------------------- | ------------- |
| POST   | `/register`       | Register a new user       | Yes (admin)   |
| POST   | `/login`          | Login and receive a token | No            |
| POST   | `/logout`         | Logout (invalidate token) | Yes           |
| POST   | `/disable`        | Disable user account      | Yes (admin)   |
| PUT    | `/changepassword` | Change user password      | Yes           |

### Article Routes

| Method | Endpoint | Description          | Auth Required |
| ------ | -------- | -------------------- | ------------- |
| POST   | `/`      | Create a new article | Yes           |
| PUT    | `/:id`   | Update an article    | Yes (owner)   |
| GET    | `/`      | List/search articles | No            |
| DELETE | `/:id`   | Delete an article    | Yes (owner)   |

**Article listing supports:**

- Pagination (`skip`, `limit`)
- Sorting (`sort`)
- Search (`search`)
- Filtering by date and published status (`show`)

---

## Validation & Security

- **Passwords** are hashed with PBKDF2 and a unique salt per user.
- **Email** is validated and sanitized.
- **Rate limiting** is applied to all routes.
- **Input validation** is enforced for all user and article data.
- **Token expiration** and sliding expiration are implemented.
- **Sensitive fields** (like password hash and salt) are never exposed in API responses.

---
