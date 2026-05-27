ALTER TABLE "evaluation"."evaluations"
ADD COLUMN IF NOT EXISTS "results_visibility" VARCHAR(20) NOT NULL DEFAULT 'after_deadline';