-- CreateEnum
CREATE TYPE "SchoolSeasonStatus" AS ENUM ('ACTIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "school_seasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SchoolSeasonStatus" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "school_seasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "school_seasons" ADD CONSTRAINT "school_seasons_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert a default active season for each existing school using deterministic md5 of the school ID
INSERT INTO "school_seasons" ("id", "name", "status", "started_at", "school_id")
SELECT md5(s.id || 'initial_season'), 'Ciclo Inicial', 'ACTIVE', s.created_at, s.id
FROM "schools" s;

-- AlterTable points - add column as nullable first
ALTER TABLE "points" ADD COLUMN "season_id" TEXT;

-- Update points to link to their school's default season
UPDATE "points" p
SET "season_id" = md5(st.school_id || 'initial_season')
FROM "students" st
WHERE p.student_id = st.id;

-- Now make it NOT NULL
ALTER TABLE "points" ALTER COLUMN "season_id" SET NOT NULL;

-- AlterTable reward_redemptions - add column as nullable first
ALTER TABLE "reward_redemptions" ADD COLUMN "school_season_id" TEXT;

-- Update reward_redemptions to link to their school's default season
UPDATE "reward_redemptions" r
SET "school_season_id" = md5(r.school_id || 'initial_season');

-- Now make it NOT NULL
ALTER TABLE "reward_redemptions" ALTER COLUMN "school_season_id" SET NOT NULL;

-- AddForeignKey points
ALTER TABLE "points" ADD CONSTRAINT "points_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "school_seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey reward_redemptions
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_school_season_id_fkey" FOREIGN KEY ("school_season_id") REFERENCES "school_seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
