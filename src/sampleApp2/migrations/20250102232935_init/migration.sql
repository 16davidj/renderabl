-- CreateTable
CREATE TABLE "Job" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMin" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "resourceUsage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
