/*
  Warnings:

  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.
  - Added the required column `imageid` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageurl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image",
ADD COLUMN     "imageid" TEXT NOT NULL,
ADD COLUMN     "imageurl" TEXT NOT NULL;
