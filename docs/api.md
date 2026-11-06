# API Reference

All responses look like `{ success, message?, data? }`. Errors look like `{ success: false, message }`.
Protected routes need the header `Authorization: Bearer <token>`.
Board routes return `404 "Board not found"` to non-members.

## Auth
| Method | URL | Body | Returns |
|---|---|---|---|
| POST | /api/auth/register | name, email, password | 201 |
| POST | /api/auth/login | email, password | data.token, data.user |
| GET | /api/auth/me | none | data.user |

## Boards
| Method | URL | Body | Returns |
|---|---|---|---|
| POST | /api/boards | name | data.board {id, name} |
| GET | /api/boards | none | data.boards [{id, name, created_by, role}] |
| GET | /api/boards/:id | none | data.board {id, name, created_by, role} |

## Columns
| Method | URL | Body | Who | Returns |
|---|---|---|---|---|
| POST | /api/boards/:id/columns | name | owner, admin | data.column |
| GET | /api/boards/:id/columns | none | any member | data.columns (by position) |

## Tasks
| Method | URL | Body | Who | Returns |
|---|---|---|---|---|
| POST | /api/boards/:id/columns/:columnId/tasks | title, description?, due_date?, assigned_to? | any member | data.task |
| GET | /api/boards/:id/tasks | none | any member | data.tasks (with assignee_name) |
| PATCH | /api/boards/:id/tasks/:taskId | any of title, description, due_date, assigned_to | any member | data.task |
| PATCH | /api/boards/:id/tasks/:taskId/move | column_id, position | any member | data.task |
| DELETE | /api/boards/:id/tasks/:taskId | none | owner, admin | message |

## Comments
| Method | URL | Body | Returns |
|---|---|---|---|
| POST | /api/boards/:id/tasks/:taskId/comments | content | data.comment (with user_name) |
| GET | /api/boards/:id/tasks/:taskId/comments | none | data.comments (oldest first) |

## Activity
| Method | URL | Returns |
|---|---|---|
| GET | /api/boards/:id/activity | data.activity (latest 50, newest first) |

## Members
| Method | URL | Body | Who | Returns |
|---|---|---|---|---|
| POST | /api/boards/:id/members | email, role? (admin or member) | owner, admin (only owner can add admins) | data.member |
| GET | /api/boards/:id/members | none | any member | data.members |