-- Existing tasks predate users, so this relation remains nullable for legacy rows.
-- Every task created through the authenticated application flow receives a userId.
ALTER TABLE "tasks" ADD COLUMN "userId" TEXT;

CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
