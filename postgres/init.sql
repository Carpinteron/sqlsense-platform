-- =========================================
-- EXTENSIONS
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- SCHEMAS
-- =========================================
CREATE SCHEMA auth;

CREATE SCHEMA academic;

CREATE SCHEMA challenge;

CREATE SCHEMA evaluation;

-- =========================================
-- AUTH MODULE
-- =========================================
CREATE TABLE auth.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO
    auth.roles (name)
VALUES ('ADMIN'),
    ('PROFESSOR'),
    ('STUDENT');

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INT REFERENCES auth.roles (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ACADEMIC MODULE (COURSES)
-- =========================================
CREATE TABLE academic.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    period VARCHAR(20) NOT NULL,
    group_number VARCHAR(10),
    professor_id UUID REFERENCES auth.users (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic.course_students (
    course_id UUID REFERENCES academic.courses (id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, student_id)
);

-- =========================================
-- CHALLENGE MODULE
-- =========================================
CREATE TYPE challenge.difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');

CREATE TYPE challenge.status_enum AS ENUM ('draft', 'published', 'archived');


CREATE TABLE challenge.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty challenge.difficulty_enum,
    tags TEXT[],
    database_engine VARCHAR(20) DEFAULT 'PostgreSQL',
    time_limit INT,
    status challenge.status_enum DEFAULT 'draft',

    course_id UUID REFERENCES academic.courses(id),
    created_by UUID REFERENCES auth.users(id),

    schema_sql TEXT,
    seed_data_sql TEXT,
    expected_result JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- SUBMISSIONS
-- =========================================
CREATE TYPE challenge.submission_status AS ENUM (
    'QUEUED',
    'RUNNING',
    'ACCEPTED',
    'WRONG_ANSWER',
    'SYNTAX_ERROR',
    'TIME_LIMIT_EXCEEDED',
    'RUNTIME_ERROR',
    'OPTIMIZATION_REQUIRED'
);

CREATE TABLE challenge.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    student_id UUID REFERENCES auth.users (id),
    challenge_id UUID REFERENCES challenge.challenges (id),
    query TEXT NOT NULL,
    status challenge.submission_status DEFAULT 'QUEUED',
    execution_time_ms INT,
    score INT,
    result JSONB,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- EVALUATION MODULE
-- =========================================
CREATE TABLE evaluation.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    duration_minutes INT,
    max_attempts INT,
    course_id UUID REFERENCES academic.courses (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluation.evaluation_challenges (
    evaluation_id UUID REFERENCES evaluation.evaluations (id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenge.challenges (id) ON DELETE CASCADE,
    PRIMARY KEY (evaluation_id, challenge_id)
);

CREATE TABLE evaluation.evaluation_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    evaluation_id UUID REFERENCES evaluation.evaluations (id),
    student_id UUID REFERENCES auth.users (id),
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- INDEXES (IMPORTANT FOR PERFORMANCE)
-- =========================================
CREATE INDEX idx_users_role ON auth.users (role_id);

CREATE INDEX idx_courses_professor ON academic.courses (professor_id);

CREATE INDEX idx_course_students_student ON academic.course_students (student_id);

CREATE INDEX idx_challenges_course ON challenge.challenges (course_id);

CREATE INDEX idx_submissions_student ON challenge.submissions (student_id);

CREATE INDEX idx_submissions_challenge ON challenge.submissions (challenge_id);

CREATE INDEX idx_evaluations_course ON evaluation.evaluations (course_id);

-- =========================================
-- OPTIONAL: BASIC SEED DATA
-- =========================================
-- Admin user (password en texto plano solo para dev)
INSERT INTO
    auth.users (email, password, role_id)
VALUES (
        'admin@sqlsense.com',
        'admin123',
        1
    );