import { config } from 'dotenv';
import { join } from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Cargamos el entorno
config({ path: join(process.cwd(), '.env') });

// 2. Configuramos el Pool de conexión nativo de PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 3. Pasamos el Pool al adaptador de Prisma
const adapter = new PrismaPg(pool);

// 4. Instanciamos el cliente inyectándole el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el sembrado (seeding) de la base de datos...');
  
  // 1. Sembrar Roles Base
  const roles = [
    { nombre: 'ASPIRANTE', descripcion: 'Usuario en proceso de admisión' },
    { nombre: 'ESTUDIANTE', descripcion: 'Estudiante regular matriculado' },
    { nombre: 'CONTROL_ESTUDIOS', descripcion: 'Personal administrativo de control de estudios' },
    { nombre: 'ADMIN', descripcion: 'Administrador de una universidad específica' },
    { nombre: 'SUPER_ADMIN', descripcion: 'Administrador global de toda la plataforma' },
  ];

  for (const rol of roles) {
    const rolCreado = await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {},
      create: rol,
    });
    console.log(`Rol verificado/creado: ${rolCreado.nombre}`);
  }

  // 2. Sembrar la Universidad Base (UPTAEB)
  const uptaeb = await prisma.universidad.upsert({
    where: { nombre: 'Universidad Politécnica Territorial del Estado Lara Andrés Eloy Blanco' },
    update: {},
    create: {
      nombre: 'Universidad Politécnica Territorial del Estado Lara Andrés Eloy Blanco',
      siglas: 'UPTAEB',
    },
  });
  console.log(`Universidad verificada/creada: ${uptaeb.siglas}`);

  // 3. Sembrar Niveles Académicos base
  const niveles = [
    { nombre: 'Pregrado', descripcion: 'Carreras de TSU y Licenciaturas/Ingenierías', requiereExclusividad: true },
    { nombre: 'Postgrado', descripcion: 'Especialidades, Maestrías y Doctorados', requiereExclusividad: false },
  ];

  for (const nivel of niveles) {
    const nivelCreado = await prisma.nivelAcademico.upsert({
      where: { nombre: nivel.nombre },
      update: {},
      create: nivel,
    });
    console.log(`Nivel académico verificado/creado: ${nivelCreado.nombre}`);
  }

  console.log('Sembrado finalizado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Cerramos el pool de conexiones nativo de postgres
  });