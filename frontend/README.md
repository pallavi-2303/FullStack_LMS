# Learning Management System (LMS)

## Overview

This is a full-stack **Learning Management System (LMS)** built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). The platform supports user authentication and provides a feature-rich admin panel for creating and managing posts, while offering a client-side view for end-users to interact with the content.

---

## Features

### User

- **Authentication**: Secure login and signup functionality with JWT-based authentication.
- **Profile Management**: Users can update their personal details.
- **View Posts**: Users can access and read posts created by admins.

### Admin

- **Admin Panel**: Create, update, delete, and manage posts directly from the admin dashboard.
- **Manage Users**: Admins can view the list of users.
- **Authentication and Authorization**: Admin access is restricted to authorized users only.

---

## Tech Stack

### Frontend

- **React.js**: UI framework for the client-side application.
- **React Router**: For navigation.
- **Axios**: For API calls.

### Backend

- **Node.js**: Server runtime environment.
- **Express.js**: Web framework for creating RESTful APIs.

### Database

- **MongoDB**: NoSQL database for storing user and post data.

---

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v14 or above)
- MongoDB
- Git

### Steps to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/<repository-name>.git
   cd <repository-name>
   ```
