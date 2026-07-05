import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('A variável DATABASE_URL não está definida nas Variáveis de Ambiente da Vercel.');
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
};
