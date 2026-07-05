import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db/index';
import { conclusoes } from '../db/schema';
import { and, eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { data } = req.query; // 'YYYY-MM-DD'
      
      let resultados;
      if (data) {
        resultados = await db.select().from(conclusoes).where(eq(conclusoes.data, data as string));
      } else {
        resultados = await db.select().from(conclusoes);
      }
      
      return res.status(200).json(resultados);
    } catch (error: any) {
      console.error('Erro ao buscar conclusões:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar conclusões', details: error.message || String(error) });
    }
  }

  if (req.method === 'POST') {
    try {
      const { exercicioId, data, marcadoPor } = req.body;
      
      if (!exercicioId || !data) {
        return res.status(400).json({ error: 'exercicioId e data são obrigatórios' });
      }

      // Verifica se já existe a conclusão para este exercício nesta data
      const conclusaoExistente = await db.select().from(conclusoes).where(
        and(
          eq(conclusoes.exercicioId, exercicioId),
          eq(conclusoes.data, data)
        )
      );

      if (conclusaoExistente.length > 0) {
        // Se existe, deleta (Toggle = OFF)
        await db.delete(conclusoes).where(
          and(
            eq(conclusoes.exercicioId, exercicioId),
            eq(conclusoes.data, data)
          )
        );
        return res.status(200).json({ status: 'unmarked' });
      } else {
        // Se não existe, cria (Toggle = ON)
        await db.insert(conclusoes).values({
          exercicioId,
          data,
          marcadoPor
        });
        return res.status(201).json({ status: 'marked' });
      }
    } catch (error: any) {
      console.error('Erro ao alternar conclusão:', error);
      return res.status(500).json({ error: 'Erro interno', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
