import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { execucaoExercicio } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'PATCH') {
    try {
      const { id, feito } = req.body;
      if (!id || feito === undefined) return res.status(400).json({ error: 'ID e feito são obrigatórios' });

      const db = getDb();
      const [execAtualizada] = await db.update(execucaoExercicio)
        .set({ feito })
        .where(eq(execucaoExercicio.id, id))
        .returning();

      return res.status(200).json(execAtualizada);
    } catch (error: any) {
      console.error('Erro ao atualizar execução:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
