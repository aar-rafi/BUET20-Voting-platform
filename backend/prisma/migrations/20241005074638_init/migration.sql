-- CreateTable
CREATE TABLE "User" (
    "sid" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Name" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "Name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "VOTE_LIMIT" INTEGER NOT NULL,
    "OPTION_LIMIT" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserVotes" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Name_name_key" ON "Name"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserVotes_AB_unique" ON "_UserVotes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserVotes_B_index" ON "_UserVotes"("B");

-- AddForeignKey
ALTER TABLE "_UserVotes" ADD CONSTRAINT "_UserVotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Name"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserVotes" ADD CONSTRAINT "_UserVotes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("sid") ON DELETE CASCADE ON UPDATE CASCADE;
