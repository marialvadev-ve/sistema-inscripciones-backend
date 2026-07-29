/*
  Warnings:

  - You are about to drop the `Expediente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuarioId,rolId,universidadId]` on the table `UsuarioRol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('PENDIENTE', 'SUBIDO', 'RECHAZADO');

-- DropForeignKey
ALTER TABLE "Expediente" DROP CONSTRAINT "Expediente_solicitudIngresoId_fkey";

-- DropIndex
DROP INDEX "UsuarioRol_usuarioId_rolId_key";

-- AlterTable
ALTER TABLE "UsuarioRol" ADD COLUMN     "universidadId" TEXT;

-- DropTable
DROP TABLE "Expediente";

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" TEXT NOT NULL,
    "universidadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "minImagenes" INTEGER NOT NULL DEFAULT 1,
    "maxImagenes" INTEGER,
    "obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudDocumento" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "tipoDocumentoId" TEXT NOT NULL,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentoImagen" (
    "id" TEXT NOT NULL,
    "solicitudDocumentoId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoImagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_universidadId_nombre_key" ON "TipoDocumento"("universidadId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudDocumento_solicitudId_tipoDocumentoId_key" ON "SolicitudDocumento"("solicitudId", "tipoDocumentoId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuarioId_rolId_universidadId_key" ON "UsuarioRol"("usuarioId", "rolId", "universidadId");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoDocumento" ADD CONSTRAINT "TipoDocumento_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDocumento" ADD CONSTRAINT "SolicitudDocumento_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudIngreso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDocumento" ADD CONSTRAINT "SolicitudDocumento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoImagen" ADD CONSTRAINT "DocumentoImagen_solicitudDocumentoId_fkey" FOREIGN KEY ("solicitudDocumentoId") REFERENCES "SolicitudDocumento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
