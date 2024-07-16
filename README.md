** *Remember to star 🌟 the repo. Thank you* **

# Iranti

## Introduction

Welcome to the backend repository for **Iranti**, your ultimate note-taking application. This backend service powers the Iranti app, providing secure user authentication, note management, reminders, and collaborative features. This repository contains the API and database management code necessary to support the frontend clients.

## Features

- **User Authentication**: Secure sign-up and login process to keep user notes private and safe.
- **Reminders**: Set reminders for notes to ensure users never forget important tasks or information.
- **Clusters**: Organize notes into groups called clusters, each with a unique title and description.
- **Collaborators**: Share clusters with others and work collaboratively. Cluster owners can add or remove collaborators.
- **Note Management**: Easily move notes between clusters to keep information organized.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sadewole/iranti-backend.git
   cd iranti-backend
   ```

2. **Install Dependencies**:

   ```bash
   yarn install
   ```

3. **Build and Run the Docker Container**:

   ```bash
   docker-compose up --build
   ```

4. **Environment Configuration**:

   - Create a `.env` file in the root directory.
   - Follow the `.env.sample` to update your environment

5. **Run the Server**:
   ```bash
   yarn run start:dev
   ```

### Connect to docker postgres (unnecessary)

```
docker-compose exec -it [your_postgres_container_name] psql -U [your_username] -d [your_database_name]
```

## API Documentation

- [Swagger](https://localhost:5500/api/docs)

## Contact

For any questions or support, please contact [@samador](https://twitter.com/samador9).

Thank you for contributing to Iranti!

---

**Iranti App - Backend** © 2024. All rights reserved.
