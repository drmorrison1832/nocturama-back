# Nocturama Backend

_Readme created with using GitHub Copilot._
_Must be reviewed._

**Nocturama** is the backend for a bookstore’s website, featuring a blog where the bookstore owners share and discuss selected books.  
This project is developed ad honorem for the bookstore, with a React frontend (work in progress).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Article Routes](#article-routes)
- [Validation & Security](#validation--security)
- [Contributing](#contributing)
- [License](#license)
- [To Do](#to-do)

---

## Project Overview

This backend powers the Nocturama bookstore website and blog.  
It manages user authentication, article creation and management, and enforces security and validation best practices.

---

## Features

- User registration, login, logout, and password change
- Token-based authentication (with plans to migrate to JWT)
- Article CRUD (create, read, update, delete)
- Article search, filtering, sorting, and pagination
- Input validation and sanitization
- Rate limiting for security
- Owner/admin logic for article editing (admin features planned)
- Robust error handling and logging

---

## Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **express-validator** for input validation
- **crypto** for password hashing
- **express-rate-limit** for rate limiting
- **helmet** for security headers
- **validator** for email and string sanitization

---

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/nocturama-back.git
   cd nocturama-back
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up your `.env` file:**  
   Example:

   ```
   PORT=3200
   MONGODB_URI_LOCAL=mongodb://localhost:27017/nocturama
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   ```

4. **Start the server:**
   ```sh
   npm start
   ```

---

## Environment Variables

| Variable            | Description                         | Example                               |
| ------------------- | ----------------------------------- | ------------------------------------- |
| `PORT`              | Port to run the server on           | `3200`                                |
| `MONGODB_URI_LOCAL` | Local MongoDB connection string     | `mongodb://localhost:27017/nocturama` |
| `JWT_SECRET`        | Secret for JWT signing (future use) | `your_jwt_secret`                     |
| `JWT_EXPIRES_IN`    | JWT expiration (future use)         | `1h`                                  |

---

## API Endpoints

### User Routes

| Method | Endpoint          | Description               | Auth Required |
| ------ | ----------------- | ------------------------- | ------------- |
| POST   | `/register`       | Register a new user       | No            |
| POST   | `/login`          | Login and receive a token | No            |
| POST   | `/logout`         | Logout (invalidate token) | Yes           |
| POST   | `/disable`        | Disable user account      | Yes           |
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
- **Rate limiting** is applied to sensitive routes.
- **Input validation** is enforced for all user and article data.
- **Token expiration** and sliding expiration are implemented.
- **Sensitive fields** (like password hash and salt) are never exposed in API responses.

---
