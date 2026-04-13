-- CreateEnum
CREATE TYPE "CaptureType" AS ENUM ('TEXT', 'VOICE', 'DOCUMENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capture" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CaptureType" NOT NULL,
    "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Capture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptureContent" (
    "id" TEXT NOT NULL,
    "captureId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "CaptureContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptureFile" (
    "id" TEXT NOT NULL,
    "captureId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "durationSeconds" INTEGER,

    CONSTRAINT "CaptureFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingJob" (
    "id" TEXT NOT NULL,
    "captureId" TEXT NOT NULL,
    "status" "ProcessingStatus" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptureTopic" (
    "captureId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "CaptureTopic_pkey" PRIMARY KEY ("captureId","topicId")
);

-- CreateTable
CREATE TABLE "CaptureConnection" (
    "id" TEXT NOT NULL,
    "fromCaptureId" TEXT NOT NULL,
    "toCaptureId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaptureConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Capture_userId_createdAt_idx" ON "Capture"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Capture_userId_deletedAt_idx" ON "Capture"("userId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CaptureContent_captureId_key" ON "CaptureContent"("captureId");

-- CreateIndex
CREATE UNIQUE INDEX "CaptureFile_captureId_key" ON "CaptureFile"("captureId");

-- CreateIndex
CREATE INDEX "ProcessingJob_captureId_idx" ON "ProcessingJob"("captureId");

-- CreateIndex
CREATE INDEX "CaptureConnection_fromCaptureId_idx" ON "CaptureConnection"("fromCaptureId");

-- CreateIndex
CREATE INDEX "CaptureConnection_toCaptureId_idx" ON "CaptureConnection"("toCaptureId");

-- AddForeignKey
ALTER TABLE "Capture" ADD CONSTRAINT "Capture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureContent" ADD CONSTRAINT "CaptureContent_captureId_fkey" FOREIGN KEY ("captureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureFile" ADD CONSTRAINT "CaptureFile_captureId_fkey" FOREIGN KEY ("captureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingJob" ADD CONSTRAINT "ProcessingJob_captureId_fkey" FOREIGN KEY ("captureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureTopic" ADD CONSTRAINT "CaptureTopic_captureId_fkey" FOREIGN KEY ("captureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureTopic" ADD CONSTRAINT "CaptureTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureConnection" ADD CONSTRAINT "CaptureConnection_fromCaptureId_fkey" FOREIGN KEY ("fromCaptureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureConnection" ADD CONSTRAINT "CaptureConnection_toCaptureId_fkey" FOREIGN KEY ("toCaptureId") REFERENCES "Capture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
