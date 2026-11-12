# Kanban

A team task board for organizing work into boards, columns, and cards. Drag tasks between columns, assign them to teammates, discuss them in comments, and follow everything in a live activity feed.


## Features

- Create boards with columns and tasks
- Drag and drop tasks between columns and reorder them within a column
- Task details: description, due date, and assignee
- Comments on tasks
- Activity feed with an unread count and highlights for new entries
- Team members with roles (owner, admin, member)
- Landing page, protected routes, and JWT authentication

## Tech stack

| Layer    | Tools                                                    |
| -------- | -------------------------------------------------------- |
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, dnd-kit |
| Backend  | Node.js, Express, MySQL (mysql2)                         |
| Auth     | JWT, bcrypt                                              |

## Getting started

### Prerequisites

- Node.js 18 or newer
- MySQL 8 or newer

### 1. Clone the repo

```bash
git clone https://github.com/EvanBatac/kanban-board.git
cd kanban-board
```

### 2. Set up the database

```bash
mysql -u root -p -e "CREATE DATABASE kanban_board;"
mysql -u root -p kanban < server/db/schema.sql
```

### 3. Run the server

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=3000
DB_HOST=localhost
DB_NAME=kanban_board
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

Then start it:

```bash
npm run dev
```

### 4. Run the client

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Then start it:

```bash
npm run dev
```

Open http://localhost:5173.

## Roles

- **Owner:** everything, including deleting the board and adding admins
- **Admin:** add members and delete columns
- **Member:** create, edit, move, and comment on tasks

## API overview

All routes except register and login need the header `Authorization: Bearer <token>`.

| Method | Path                                          | Description               |
| ------ | --------------------------------------------- | ------------------------- |
| POST   | `/api/auth/register`                          | Create an account         |
| POST   | `/api/auth/login`                             | Log in and get a token    |
| GET    | `/api/auth/me`                                | Get the current user      |
| GET    | `/api/boards`                                 | List your boards          |
| POST   | `/api/boards`                                 | Create a board            |
| GET    | `/api/boards/:id`                             | Get a board               |
| DELETE | `/api/boards/:id`                             | Delete a board (owner)    |
| GET    | `/api/boards/:id/members`                     | List members              |
| POST   | `/api/boards/:id/members`                     | Add a member by email     |
| GET    | `/api/boards/:id/columns`                     | List columns              |
| POST   | `/api/boards/:id/columns`                     | Create a column           |
| DELETE | `/api/boards/:id/columns/:columnId`           | Delete a column           |
| GET    | `/api/boards/:id/tasks`                       | List the board's tasks    |
| POST   | `/api/boards/:id/columns/:columnId/tasks`     | Create a task             |
| PATCH  | `/api/boards/:id/tasks/:taskId`               | Update a task             |
| PATCH  | `/api/boards/:id/tasks/:taskId/move`          | Move a task               |
| DELETE | `/api/boards/:id/tasks/:taskId`               | Delete a task             |
| GET    | `/api/boards/:id/tasks/:taskId/comments`      | List comments             |
| POST   | `/api/boards/:id/tasks/:taskId/comments`      | Add a comment             |
| GET    | `/api/boards/:id/activity`                    | Get recent activity       |

## What's next

- Replies to comments
- Rename boards and columns
- Real-time updates with Socket.IO

## Author

Evan Batac — [GitHub](https://github.com/EvanBatac)