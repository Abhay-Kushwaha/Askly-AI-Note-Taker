/*
  Warnings:

  - You are about to drop the column `questions` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `answer` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "questions",
ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL;
