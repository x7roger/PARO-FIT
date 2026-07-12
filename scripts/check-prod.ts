import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import { grupoMuscular, exercicio } from '../db/schema.js';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function check() {
  const grupos = await db.select().from(grupoMuscular);
  const exercicios = await db.select().from(exercicio);
  console.log(`Contagem de grupos: ${grupos.length}`);
  console.log(`Contagem de exercícios: ${exercicios.length}`);
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
