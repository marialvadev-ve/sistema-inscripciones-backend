-- AlterTable
ALTER TABLE "Estudiante" ADD COLUMN     "excepcionAutorizadaPorId" TEXT,
ADD COLUMN     "excepcionFecha" TIMESTAMP(3),
ADD COLUMN     "excepcionMotivo" TEXT,
ADD COLUMN     "expedienteCompleto" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Universidad" ADD COLUMN     "permiteExcepcionExpedienteIncompleto" BOOLEAN NOT NULL DEFAULT true;
