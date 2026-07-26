/*
  Warnings:

  - You are about to drop the column `expedienteKey` on the `SolicitudIngreso` table. All the data in the column will be lost.
  - You are about to drop the column `expedienteSubidoAt` on the `SolicitudIngreso` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SolicitudIngreso" DROP COLUMN "expedienteKey",
DROP COLUMN "expedienteSubidoAt";

-- CreateTable
CREATE TABLE "Expediente" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "solicitudIngresoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expediente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expediente_solicitudIngresoId_key" ON "Expediente"("solicitudIngresoId");

-- AddForeignKey
ALTER TABLE "Expediente" ADD CONSTRAINT "Expediente_solicitudIngresoId_fkey" FOREIGN KEY ("solicitudIngresoId") REFERENCES "SolicitudIngreso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
