-- Users table (students, teachers, admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL,
  name VARCHAR(255) NOT NULL,
  grade_level INT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher_id INT REFERENCES users(id) ON DELETE CASCADE,
  access_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student-Classroom relationship (many-to-many)
CREATE TABLE IF NOT EXISTS classroom_students (
  classroom_id INT REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (classroom_id, student_id)
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
  content_type VARCHAR(20) CHECK (content_type IN ('visual', 'text', 'mixed')),
  content_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning Events (the core sync data)
CREATE TABLE IF NOT EXISTS learning_events (
  id VARCHAR(255) PRIMARY KEY, -- UUID from client
  student_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  score INT CHECK (score BETWEEN 0 AND 100),
  time_spent INT, -- seconds
  attempts INT,
  completed_at TIMESTAMP NOT NULL,
  synced_at TIMESTAMP DEFAULT NOW(),
  device_id VARCHAR(255) -- For conflict resolution
);

-- Recommendations (AI-generated)
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  confidence DECIMAL(3,2), -- 0.00 to 1.00
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_learning_events_student ON learning_events(student_id);
CREATE INDEX idx_learning_events_lesson ON learning_events(lesson_id);
CREATE INDEX idx_learning_events_completed ON learning_events(completed_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
