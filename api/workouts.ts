import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db/index';
import { exercicios } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { diaSemana } = req.query;
      
      let data;
      if (diaSemana) {
        data = await db.select().from(exercicios).where(eq(exercicios.diaSemana, parseInt(diaSemana as string)));
      } else {
        data = await db.select().from(exercicios);
      }
      
      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Erro ao buscar exercícios:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar exercícios', details: error.message || String(error) });
    }
  }

  if (req.method === 'POST') {
    try {
      const { diaSemana, bloco, ordemBloco, nome, series, reps, ordem } = req.body;
      const novoExercicio = await db.insert(exercicios).values({
        diaSemana,
        bloco,
        ordemBloco,
        nome,
        series,
        reps,
        ordem
      }).returning();

      return res.status(201).json(novoExercicio[0]);
    } catch (error: any) {
      console.error('Erro ao criar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao criar exercício', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
