/*
  Warnings:

  - A unique constraint covering the columns `[universidadId,nombre]` on the table `ConvocatoriaIngreso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[universidadId,nombre]` on the table `OrigenIngreso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[universidadId,nombre]` on the table `TipoIngreso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `universidadId` to the `ConvocatoriaIngreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universidadId` to the `OrigenIngreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universidadId` to the `TipoIngreso` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OrigenIngreso_nombre_key";

-- DropIndex
DROP INDEX "TipoIngreso_nombre_key";

-- AlterTable
ALTER TABLE "ConvocatoriaIngreso" ADD COLUMN     "universidadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrigenIngreso" ADD COLUMN     "universidadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TipoIngreso" ADD COLUMN     "universidadId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConvocatoriaIngreso_universidadId_nombre_key" ON "ConvocatoriaIngreso"("universidadId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "OrigenIngreso_universidadId_nombre_key" ON "OrigenIngreso"("universidadId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TipoIngreso_universidadId_nombre_key" ON "TipoIngreso"("universidadId", "nombre");

-- AddForeignKey
ALTER TABLE "TipoIngreso" ADD CONSTRAINT "TipoIngreso_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConvocatoriaIngreso" ADD CONSTRAINT "ConvocatoriaIngreso_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrigenIngreso" ADD CONSTRAINT "OrigenIngreso_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
