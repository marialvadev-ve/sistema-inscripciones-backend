/*
  Warnings:

  - A unique constraint covering the columns `[personaId,universidadId]` on the table `Estudiante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[universidadId,codigo]` on the table `ProgramaFormacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `universidadId` to the `Estudiante` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Estudiante_personaId_key";

-- DropIndex
DROP INDEX "ProgramaFormacion_codigo_key";

-- AlterTable
ALTER TABLE "Estudiante" ADD COLUMN     "universidadId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_personaId_universidadId_key" ON "Estudiante"("personaId", "universidadId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaFormacion_universidadId_codigo_key" ON "ProgramaFormacion"("universidadId", "codigo");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
