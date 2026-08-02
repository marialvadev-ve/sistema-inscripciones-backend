-- AlterEnum
ALTER TYPE "EstadoDocumento" ADD VALUE 'APROBADO';

-- AlterTable
ALTER TABLE "SolicitudDocumento" ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "revisadoEn" TIMESTAMP(3),
ADD COLUMN     "revisadoPorId" TEXT;

-- AlterTable
ALTER TABLE "SolicitudIngreso" ADD COLUMN     "observacionGeneral" TEXT;
