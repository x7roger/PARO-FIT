import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { exercicio } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { grupoMuscularId } = req.query;
      if (!grupoMuscularId) return res.status(400).json({ error: 'grupoMuscularId é obrigatório' });
      
      const db = getDb();
      const data = await db
        .select()
        .from(exercicio)
        .where(eq(exercicio.grupoMuscularId, grupoMuscularId as string))
        .orderBy(asc(exercicio.criadoEm)); // Or another ordering if preferred
      
      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Erro ao buscar exercícios:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar exercícios', details: error.message || String(error) });
    }
  }

  if (req.method === 'POST') {
    try {
      const { grupoMuscularId, nome, series, repeticoes, ativo } = req.body;
      const db = getDb();
      const novoExercicio = await db.insert(exercicio).values({
        grupoMuscularId,
        nome,
        series: Number(series),
        repeticoes,
        ativo: ativo ?? true
      }).returning();

      return res.status(201).json(novoExercicio[0]);
    } catch (error: any) {
      console.error('Erro ao criar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao criar exercício', details: error.message || String(error) });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, nome, series, repeticoes } = req.body;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
      
      const db = getDb();
      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome;
      if (series !== undefined) updateData.series = Number(series);
      if (repeticoes !== undefined) updateData.repeticoes = repeticoes;

      const exercicioAtualizado = await db.update(exercicio)
        .set(updateData)
        .where(eq(exercicio.id, id))
        .returning();

      return res.status(200).json(exercicioAtualizado[0]);
    } catch (error: any) {
      console.error('Erro ao atualizar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar', details: error.message || String(error) });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, ativo } = req.body;
      if (!id || ativo === undefined) return res.status(400).json({ error: 'ID e ativo são obrigatórios' });

      const db = getDb();
      const exercicioAtualizado = await db.update(exercicio)
        .set({ ativo })
        .where(eq(exercicio.id, id))
        .returning();

      return res.status(200).json(exercicioAtualizado[0]);
    } catch (error: any) {
      console.error('Erro ao alternar status do exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao alternar status', details: error.message || String(error) });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const db = getDb();
      await db.delete(exercicio).where(eq(exercicio.id, id as string));

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Erro ao deletar exercício:', error);
      return res.status(500).json({ error: 'Erro interno ao deletar', details: error.message || String(error) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
