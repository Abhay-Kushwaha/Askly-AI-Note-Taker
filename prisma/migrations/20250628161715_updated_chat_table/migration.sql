/*
  Warnings:

  - You are about to drop the column `answer` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `questions` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "answer",
DROP COLUMN "question",
ADD COLUMN     "questions" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
