import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { grupoMuscular } from '../db/schema.js';
import { asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const grupos = await db
        .select()
        .from(grupoMuscular)
        .orderBy(asc(grupoMuscular.ordem));
      
      return res.status(200).json(grupos);
    } catch (error: any) {
      console.error('Erro ao buscar grupos musculares:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar grupos', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
