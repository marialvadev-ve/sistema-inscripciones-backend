/*
  Warnings:

  - Added the required column `especialidadId` to the `SolicitudIngreso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EstadoSolicitud" ADD VALUE 'ANULADA';

-- DropIndex
DROP INDEX "SolicitudIngreso_estudianteId_key";

-- DropIndex
DROP INDEX "SolicitudIngreso_usuarioId_key";

-- AlterTable
ALTER TABLE "SolicitudIngreso" ADD COLUMN     "especialidadId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NivelAcademico" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "requiereExclusividad" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NivelAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramaFormacion" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "nivelAcademicoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramaFormacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NivelAcademico_nombre_key" ON "NivelAcademico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaFormacion_codigo_key" ON "ProgramaFormacion"("codigo");

-- AddForeignKey
ALTER TABLE "ProgramaFormacion" ADD CONSTRAINT "ProgramaFormacion_nivelAcademicoId_fkey" FOREIGN KEY ("nivelAcademicoId") REFERENCES "NivelAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudIngreso" ADD CONSTRAINT "SolicitudIngreso_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "ProgramaFormacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
