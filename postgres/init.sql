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
CREATE TABLE "auth"."roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER,
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
CREATE UNIQUE INDEX "roles_name_key" ON "auth"."roles" ("name");

CREATE UNIQUE INDEX "users_email_key" ON "auth"."users" ("email");

CREATE INDEX "idx_users_role" ON "auth"."users" ("role_id");

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
ALTER TABLE "auth"."users"
ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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