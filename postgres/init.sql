-- =========================================
-- EXTENSIONS
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- SCHEMAS
-- =========================================
CREATE SCHEMA IF NOT EXISTS "academic";

CREATE SCHEMA IF NOT EXISTS "auth";

CREATE SCHEMA IF NOT EXISTS "challenge";

CREATE SCHEMA IF NOT EXISTS "evaluation";

-- =========================================
-- AUTH MODULE
-- =========================================
CREATE TYPE "auth"."user_role" AS ENUM ('ADMIN', 'STUDENT', 'PROFESSOR');

CREATE TABLE "auth"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "auth"."user_role" NOT NULL DEFAULT 'STUDENT', -- Cambio aquí
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- =========================================
-- ACADEMIC MODULE (COURSES)
-- =========================================
CREATE TABLE "academic"."courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "group_number" VARCHAR(10),
    "professor_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "academic"."course_students" (
    "course_id" UUID NOT NULL,
    "student_id" INTEGER NOT NULL,
    CONSTRAINT "course_students_pkey" PRIMARY KEY ("course_id", "student_id")
);

-- =========================================
-- CHALLENGE MODULE
-- =========================================
CREATE TYPE "challenge"."difficulty_enum" AS ENUM ('Easy', 'Medium', 'Hard');

CREATE TYPE "challenge"."status_enum" AS ENUM ('draft', 'published', 'archived');

CREATE TYPE "challenge"."submission_status" AS ENUM (
    'QUEUED',
    'RUNNING',
    'ACCEPTED',
    'WRONG_ANSWER',
    'SYNTAX_ERROR',
    'TIME_LIMIT_EXCEEDED',
    'RUNTIME_ERROR',
    'OPTIMIZATION_REQUIRED'
);

CREATE TABLE "challenge"."challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "challenge"."difficulty_enum",
    "tags" TEXT [],
    "database_engine" VARCHAR(20) DEFAULT 'PostgreSQL',
    "time_limit" INTEGER,
    "status" "challenge"."status_enum" DEFAULT 'draft',
    "course_id" UUID,
    "created_by" INTEGER,
    "schema_sql" TEXT,
    "seed_data_sql" TEXT,
    "expected_result" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- =========================================
-- SUBMISSIONS
-- =========================================
CREATE TABLE "challenge"."submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "student_id" INTEGER,
    "challenge_id" UUID,
    "query" TEXT NOT NULL,
    "status" "challenge"."submission_status" DEFAULT 'QUEUED',
    "execution_time_ms" INTEGER,
    "score" INTEGER,
    "result" JSONB,
    "feedback" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- =========================================
-- EVALUATION MODULE
-- =========================================
CREATE TABLE "evaluation"."evaluation_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "evaluation_id" UUID,
    "student_id" INTEGER,
    "started_at" TIMESTAMP(6),
    "submitted_at" TIMESTAMP(6),
    "score" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluation_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evaluation"."evaluation_challenges" (
    "evaluation_id" UUID NOT NULL,
    "challenge_id" UUID NOT NULL,
    CONSTRAINT "evaluation_challenges_pkey" PRIMARY KEY (
        "evaluation_id",
        "challenge_id"
    )
);

CREATE TABLE "evaluation"."evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid (),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "duration_minutes" INTEGER,
    "max_attempts" INTEGER,
    "course_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- =========================================
-- INDEXES (IMPORTANT FOR PERFORMANCE)
-- =========================================
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users" ("email");

CREATE UNIQUE INDEX "courses_code_key" ON "academic"."courses" ("code");

CREATE INDEX "idx_courses_professor" ON "academic"."courses" ("professor_id");

CREATE INDEX "idx_course_students_student" ON "academic"."course_students" ("student_id");

CREATE INDEX "idx_challenges_course" ON "challenge"."challenges" ("course_id");

CREATE INDEX "idx_submissions_challenge" ON "challenge"."submissions" ("challenge_id");

CREATE INDEX "idx_submissions_student" ON "challenge"."submissions" ("student_id");

CREATE INDEX "idx_evaluations_course" ON "evaluation"."evaluations" ("course_id");

-- =========================================
-- FOREIGN KEYS
-- =========================================
ALTER TABLE "academic"."courses"
ADD CONSTRAINT "courses_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "academic"."course_students"
ADD CONSTRAINT "course_students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "academic"."courses" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "academic"."course_students"
ADD CONSTRAINT "course_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "challenge"."challenges"
ADD CONSTRAINT "challenges_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "academic"."courses" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "challenge"."challenges"
ADD CONSTRAINT "challenges_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "challenge"."submissions"
ADD CONSTRAINT "submissions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenge"."challenges" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "challenge"."submissions"
ADD CONSTRAINT "submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "evaluation"."evaluation_attempts"
ADD CONSTRAINT "evaluation_attempts_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"."evaluations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "evaluation"."evaluation_attempts"
ADD CONSTRAINT "evaluation_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "auth"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "evaluation"."evaluation_challenges"
ADD CONSTRAINT "evaluation_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenge"."challenges" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "evaluation"."evaluation_challenges"
ADD CONSTRAINT "evaluation_challenges_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"."evaluations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "evaluation"."evaluations"
ADD CONSTRAINT "evaluations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "academic"."courses" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;



-- =========================================
-- SEED DATA (USUARIO DE PRUEBA)
-- =========================================

-- Insertar un administrador por defecto
-- Contraseña: 123456
INSERT INTO "auth"."users" ("email", "password", "role") 
VALUES (
    'admin@sqlsense.com', 
    '$2b$10$M/kq/PF4.AVHaKe8xG3HLeIlTXVqdLMXHqA6QxTF.pIDDTjWCUNV6', 
    'ADMIN'
);


BEGIN;

-- Limpieza previa por si ya existen para evitar errores de duplicados
DELETE FROM "challenge"."submissions" WHERE "student_id" = 99;
DELETE FROM "challenge"."challenges" WHERE "id" = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM "academic"."course_students" WHERE "student_id" = 99;
DELETE FROM "academic"."courses" WHERE "id" = 'aabbccdd-1111-2222-3333-444455556666';
DELETE FROM "auth"."users" WHERE "id" IN (88, 99);

-- 1. Insertar Profesor (ID: 88)
INSERT INTO "auth"."users" ("id", "email", "password", "role")
VALUES (88, 'profesor@sqlsense.com', '$2b$10$M/kq/PF4.AVHaKe8xG3HLeIlTXVqdLMXHqA6QxTF.pIDDTjWCUNV6', 'PROFESSOR');

-- 2. Insertar Estudiante (ID: 99)
INSERT INTO "auth"."users" ("id", "email", "password", "role")
VALUES (99, 'estudiante@sqlsense.com', '$2b$10$M/kq/PF4.AVHaKe8xG3HLeIlTXVqdLMXHqA6QxTF.pIDDTjWCUNV6', 'STUDENT');

-- 3. Insertar Curso
INSERT INTO "academic"."courses" ("id", "name", "code", "period", "group_number", "professor_id")
VALUES ('aabbccdd-1111-2222-3333-444455556666', 'Curso Manual Postman', 'MANUAL-101', '2026-I', 'G1', 88);

-- 4. Vincular Estudiante al Curso
INSERT INTO "academic"."course_students" ("course_id", "student_id")
VALUES ('aabbccdd-1111-2222-3333-444455556666', 99);

-- 5. Insertar Desafío (ID exacto que usaremos en Postman)
INSERT INTO "challenge"."challenges" (
    "id", "title", "description", "difficulty", "tags", 
    "database_engine", "time_limit", "status", "course_id", "created_by",
    "schema_sql", "seed_data_sql", "expected_result"
)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Reto Manual de Prueba',
    'Selecciona el email de todos los usuarios.',
    'Easy'::"challenge"."difficulty_enum",
    ARRAY['select'],
    'PostgreSQL',
    3000,
    'published'::"challenge"."status_enum",
    'aabbccdd-1111-2222-3333-444455556666',
    88,
    'CREATE TABLE users ( id INT PRIMARY KEY, email VARCHAR(255), username VARCHAR(100), password_hash VARCHAR(255), created_at TIMESTAMP );',
    
    'INSERT INTO users (id, email, username, password_hash, created_at) VALUES
(10, ''alice.johnson@example.com'', ''alice_johnson'', ''$2a$10$rKp8xMn9vQ7wLz5rT3sY1uE6oI4hG2fJ9dX8cV0bN7mL5kP3qR1'', ''2021-03-15''),
(45, ''bob.smith@domain.net'', ''bob_smith_99'', ''$2a$10$sT7uI9oL3xR5nM8vQ1wE6yH4jK2fD9cX7bV5mN3lP1qG8rJ4tY'', ''2022-07-22''),
(128, ''charlie.wong@company.org'', ''charlie_w'', ''$2a$10$tY5rJ9xL3oM8nV1wQ6sE4uH7jK9fD2cX5bV8mN1lP3qG6rJ7tY'', ''2020-11-08''),
(256, ''diana.lee@startup.io'', ''diana_lee_dev'', ''$2a$10$vQ3rJ8xL5oM9nV2wQ7sE4uH8jK1fD6cX4bV9mN2lP5qG9rJ8tY'', ''2023-05-19''),
(512, ''edward.chen@global.com'', ''edward_chen'', ''$2a$10$wL4rJ7xM3oN8vQ9sE2uH5jK6fD1cX8bV4mN9lP2qG5rJ1tY'', ''2024-09-03''),
(75, ''fiona.martinez@tech.co'', ''fiona_m'', ''$2a$10$xM8vQ3rJ9sE5uH2jK7fD4cX1bV6mN3lP9qG8rJ2tY5wL'', ''2025-01-28''),
(903, ''george.brown@business.net'', ''george_brown_2024'', ''$2a$10$yH5jK8vQ2rJ9sE6uH3fD7cX4bV1mN8lP5qG2rJ9tY3wL'', ''2021-06-12''),
(142, ''hannah.wood@design.studio'', ''hannah_wood_art'', ''$2a$10$zJ9sE3vQ7rJ2uH8fD5cX1bV4mN6lP9qG3rJ7tY2wL5'', ''2023-11-25''),
(67, ''ian.harris@finance.group'', ''ian_h_finance'', ''$2a$10$sE8vQ2rJ9uH3fD7cX5bV1mN4lP6qG9rJ2tY8wL3zJ'', ''2020-04-17''),
(891, ''julia.clark@cloud.services'', ''julia_clark_cloud'', ''$2a$10$vQ3rJ9uH5fD8cX2bV6mN4lP7qG1rJ9tY3wL5zJ8sE'', ''2022-08-09'');',
    
    -- CAMBIO AQUÍ: Formato JSON válido para la columna expected_result
    '{"expected_sql": "SELECT email FROM users;"}'
);

COMMIT;