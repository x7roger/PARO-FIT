import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { exercicios } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { diaSemana } = req.query;
      
      const db = getDb();
      let data;
      if (diaSemana) {
        data = await db.select().from(exercicios).where(eq(exercicios.diaSemana, parseInt(diaSemana as string))).orderBy(asc(exercicios.ordem), asc(exercicios.ordemBloco), asc(exercicios.criadoEm));
      } else {
        data = await db.select().from(exercicios).orderBy(asc(exercicios.ordem), asc(exercicios.ordemBloco), asc(exercicios.criadoEm));
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
      const db = getDb();
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

  if (req.method === 'PUT') {
    try {
      const { id, nome, series, reps, bloco, peso } = req.body;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      
      const db = getDb();
      const updateData: any = { atualizadoEm: new Date() };
      if (nome !== undefined) updateData.nome = nome;
      if (series !== undefined) updateData.series = series;
      if (reps !== undefined) updateData.reps = reps;
      if (bloco !== undefined) updateData.bloco = bloco;
      if (peso !== undefined) updateData.peso = peso;

      const exercicioAtualizado = await db.update(exercicios)
        .set(updateData)
        .where(eq(exercicios.id, id))
        .returning();

      return res.status(200).json(exercicioAtualizado[0]);
    } catch (error: any) {
      console.error('Erro ao atualizar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar', details: error.message || String(error) });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { reorders } = req.body; // Array de { id, ordem }
      if (!Array.isArray(reorders)) return res.status(400).json({ error: 'Formato inválido' });

      const db = getDb();
      await Promise.all(
        reorders.map((r) =>
          db.update(exercicios)
            .set({ ordem: r.ordem, atualizadoEm: new Date() })
            .where(eq(exercicios.id, r.id))
        )
      );

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao reordenar exercícios:', error);
      return res.status(500).json({ error: 'Erro interno ao reordenar', details: error.message || String(error) });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const db = getDb();
      await db.delete(exercicios).where(eq(exercicios.id, id as string));

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao deletar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao deletar', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
