# Entities

## User

- id (PK)
- name
- email (unique)
- password_hash

## Board

- id (PK)
- name
- created_by (FK → User.id)

## BoardMember

- id (PK)
- user_id (FK → User.id)
- board_id (FK → Board.id)
- role (owner, admin, member)
- Unique: (user_id, board_id)

## board_columns

- id (PK)
- name
- board_id (FK → Board.id)
- position

## Task

- id (PK)
- title
- description (nullable)
- column_id (FK → board_columns.id)
- position
- due_date (nullable)
- assigned_to (FK → User.id, nullable)

## Comment

- id (PK)
- content
- task_id (FK → Task.id)
- user_id (FK → User.id)

## ActivityLog

- id (PK)
- user_id (FK → User.id)
- board_id (FK → Board.id)
- task_id (FK → Task.id, nullable, ON DELETE SET NULL)
- action (created, updated, moved, deleted)
- details (text)
- created_at
