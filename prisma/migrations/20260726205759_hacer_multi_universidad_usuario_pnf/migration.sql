/*
  Warnings:

  - Added the required column `universidadId` to the `ProgramaFormacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgramaFormacion" ADD COLUMN     "universidadId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Universidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "siglas" TEXT NOT NULL,
    "ubicacion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Universidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioUniversidad" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "universidadId" TEXT NOT NULL,

    CONSTRAINT "UsuarioUniversidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Universidad_nombre_key" ON "Universidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioUniversidad_usuarioId_universidadId_key" ON "UsuarioUniversidad"("usuarioId", "universidadId");

-- AddForeignKey
ALTER TABLE "ProgramaFormacion" ADD CONSTRAINT "ProgramaFormacion_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioUniversidad" ADD CONSTRAINT "UsuarioUniversidad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioUniversidad" ADD CONSTRAINT "UsuarioUniversidad_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
