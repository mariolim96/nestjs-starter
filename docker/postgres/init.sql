-- Create database schema for NestJS Chat Application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels/Rooms table
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    original_language VARCHAR(10),
    user_id INTEGER REFERENCES users(id),
    channel_id INTEGER REFERENCES channels(id),
    parent_message_id INTEGER REFERENCES messages(id), -- For replies
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Message translations table
CREATE TABLE IF NOT EXISTS message_translations (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id),
    language VARCHAR(10) NOT NULL,
    translated_content TEXT NOT NULL,
    translation_service VARCHAR(50), -- deepl, google, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, language)
);

-- Kanban boards table
CREATE TABLE IF NOT EXISTS kanban_boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    channel_id INTEGER REFERENCES channels(id),
    external_board_id VARCHAR(255), -- For Jira/Trello sync
    external_service VARCHAR(50), -- jira, trello, etc.
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kanban columns table
CREATE TABLE IF NOT EXISTS kanban_columns (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES kanban_boards(id),
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kanban tasks table
CREATE TABLE IF NOT EXISTS kanban_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    column_id INTEGER REFERENCES kanban_columns(id),
    assigned_to INTEGER REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'todo', -- todo, in_progress, done
    external_task_id VARCHAR(255), -- For Jira/Trello sync
    external_service VARCHAR(50),
    due_date TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External events table (GitHub, Jira, CI/CD, etc.)
CREATE TABLE IF NOT EXISTS external_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- github_push, jira_issue, ci_deploy, etc.
    service_name VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    channel_id INTEGER REFERENCES channels(id),
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channel members table
CREATE TABLE IF NOT EXISTS channel_members (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- owner, admin, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, user_id)
);

-- Indexes for better performance
CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_message_translations_message_id ON message_translations(message_id);
CREATE INDEX idx_kanban_tasks_column_id ON kanban_tasks(column_id);
CREATE INDEX idx_external_events_channel_id ON external_events(channel_id);
CREATE INDEX idx_external_events_processed ON external_events(processed);

-- Insert sample data
INSERT INTO users (username, email, password_hash, preferred_language) VALUES
('admin', 'admin@example.com', '$2b$10$dummy_hash', 'en'),
('mario', 'mario@example.com', '$2b$10$dummy_hash', 'it'),
('alice', 'alice@example.com', '$2b$10$dummy_hash', 'fr');

INSERT INTO channels (name, description, created_by) VALUES
('general', 'General discussion', 1),
('development', 'Development team chat', 1),
('random', 'Random conversations', 1);

INSERT INTO kanban_boards (name, description, channel_id, created_by) VALUES
('Development Tasks', 'Main development board', 2, 1),
('General Tasks', 'General tasks and todos', 1, 1);

INSERT INTO kanban_columns (board_id, name, position) VALUES
(1, 'Backlog', 1),
(1, 'In Progress', 2),
(1, 'Review', 3),
(1, 'Done', 4),
(2, 'To Do', 1),
(2, 'In Progress', 2),
(2, 'Completed', 3);