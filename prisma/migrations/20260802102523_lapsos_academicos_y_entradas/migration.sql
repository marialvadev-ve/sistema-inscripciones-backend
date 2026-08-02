-- CreateEnum
CREATE TYPE "TipoLapso" AS ENUM ('PREGRADO', 'POSTGRADO', 'INTENSIVO', 'ESPECIAL');

-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL,
    "universidadId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapsoAcademico" (
    "id" TEXT NOT NULL,
    "universidadId" TEXT NOT NULL,
    "entradaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoLapso" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LapsoAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_universidadId_codigo_key" ON "Entrada"("universidadId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "LapsoAcademico_universidadId_codigo_key" ON "LapsoAcademico"("universidadId", "codigo");

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapsoAcademico" ADD CONSTRAINT "LapsoAcademico_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "Universidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapsoAcademico" ADD CONSTRAINT "LapsoAcademico_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "Entrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
