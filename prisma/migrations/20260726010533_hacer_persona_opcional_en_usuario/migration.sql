-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_personaId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "personaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
