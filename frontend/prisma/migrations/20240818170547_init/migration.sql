-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
