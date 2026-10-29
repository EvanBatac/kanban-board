CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE board_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    board_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
    FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(board_id) 
        REFERENCES boards(id)
        ON DELETE CASCADE,
    UNIQUE(user_id, board_id)
);

CREATE TABLE board_columns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    board_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY(board_id) 
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    column_id INT NOT NULL,
    position INT NOT NULL,
    due_date DATETIME NULL,
    assigned_to INT NULL,
    FOREIGN KEY(column_id) 
        REFERENCES board_columns(id)
        ON DELETE CASCADE,
    FOREIGN KEY(assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    task_id INT NOT NULL,
    user_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    board_id INT NOT NULL,
    task_id INT NULL,
    action ENUM(
        'created',
        'updated',
        'moved',
        'deleted',
        'assigned',
        'commented'
    ) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE SET NULL
);