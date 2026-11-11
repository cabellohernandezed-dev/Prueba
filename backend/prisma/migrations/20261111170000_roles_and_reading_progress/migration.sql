ALTER TABLE "users"
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'consulta';

UPDATE "users"
SET "role" = 'admin'
WHERE "email" = 'demo@readingclub.com';

CREATE TABLE "reading_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reading_progress_user_id_book_id_key"
ON "reading_progress"("user_id", "book_id");

ALTER TABLE "reading_progress"
ADD CONSTRAINT "reading_progress_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reading_progress"
ADD CONSTRAINT "reading_progress_book_id_fkey"
FOREIGN KEY ("book_id") REFERENCES "books"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
