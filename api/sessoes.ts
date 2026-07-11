import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { sessaoTreino, sessaoTreinoGrupo, execucaoExercicio, exercicio, grupoMuscular } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb();
  
  if (req.method === 'GET') {
    try {
      const { data, usuarioId } = req.query;
      if (!data || !usuarioId) return res.status(400).json({ error: 'Data e usuarioId são obrigatórios' });

      // Find session
      const sessoes = await db.select().from(sessaoTreino).where(and(
        eq(sessaoTreino.data, data as string),
        eq(sessaoTreino.usuarioId, usuarioId as string)
      ));
      
      if (sessoes.length === 0) {
        return res.status(200).json(null); // No session yet
      }
      const sessao = sessoes[0];

      // Get groups for this session
      const sessaoGrupos = await db
        .select({
          id: sessaoTreinoGrupo.id,
          sessaoTreinoId: sessaoTreinoGrupo.sessaoTreinoId,
          grupoMuscularId: sessaoTreinoGrupo.grupoMuscularId,
          ordem: sessaoTreinoGrupo.ordem,
          nome: grupoMuscular.nome
        })
        .from(sessaoTreinoGrupo)
        .innerJoin(grupoMuscular, eq(sessaoTreinoGrupo.grupoMuscularId, grupoMuscular.id))
        .where(eq(sessaoTreinoGrupo.sessaoTreinoId, sessao.id))
        .orderBy(sessaoTreinoGrupo.ordem);

      // Get exercises for these groups
      const execucoes = await db
        .select({
          id: execucaoExercicio.id,
          sessaoTreinoGrupoId: execucaoExercicio.sessaoTreinoGrupoId,
          exercicioId: execucaoExercicio.exercicioId,
          feito: execucaoExercicio.feito,
          nome: exercicio.nome,
          series: exercicio.series,
          repeticoes: exercicio.repeticoes
        })
        .from(execucaoExercicio)
        .innerJoin(exercicio, eq(execucaoExercicio.exercicioId, exercicio.id));

      // Better query for execucoes:
      // Inner join with sessaoTreinoGrupo, and filter by sessao.id
      const allExecucoes = await db
        .select({
          id: execucaoExercicio.id,
          sessaoTreinoGrupoId: execucaoExercicio.sessaoTreinoGrupoId,
          exercicioId: execucaoExercicio.exercicioId,
          feito: execucaoExercicio.feito,
          nome: execucaoExercicio.nome,
          series: execucaoExercicio.series,
          repeticoes: execucaoExercicio.repeticoes,
          criadoEm: execucaoExercicio.criadoEm
        })
        .from(execucaoExercicio)
        .innerJoin(sessaoTreinoGrupo, eq(execucaoExercicio.sessaoTreinoGrupoId, sessaoTreinoGrupo.id))
        .where(eq(sessaoTreinoGrupo.sessaoTreinoId, sessao.id));

      // Assemble JSON
      const assembledGrupos = sessaoGrupos.map(g => {
        return {
          ...g,
          exercicios: allExecucoes.filter(e => e.sessaoTreinoGrupoId === g.id).sort((a, b) => a.criadoEm.getTime() - b.criadoEm.getTime())
        };
      });

      return res.status(200).json({
        ...sessao,
        grupos: assembledGrupos
      });
    } catch (error: any) {
      console.error('Erro ao buscar sessão:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar sessão', details: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { action } = req.body;
      
      if (action === 'create_session') {
        const { data, usuarioId } = req.body;
        const [novaSessao] = await db.insert(sessaoTreino).values({
          usuarioId,
          data
        }).returning();
        return res.status(201).json(novaSessao);
      }
      
      if (action === 'add_group') {
        const { sessaoTreinoId, grupoMuscularId, ordem } = req.body;
        
        // 1. Insert sessaoTreinoGrupo
        const [novoGrupo] = await db.insert(sessaoTreinoGrupo).values({
          sessaoTreinoId,
          grupoMuscularId,
          ordem
        }).returning();

        // 2. Fetch active exercises for this group
        const exerciciosAtivos = await db
          .select()
          .from(exercicio)
          .where(and(eq(exercicio.grupoMuscularId, grupoMuscularId), eq(exercicio.ativo, true)));

        // 3. Create execucaoExercicio for each with snapshots
        if (exerciciosAtivos.length > 0) {
          const execucoesData = exerciciosAtivos.map(ex => ({
            sessaoTreinoGrupoId: novoGrupo.id,
            exercicioId: ex.id,
            nome: ex.nome,
            series: ex.series,
            repeticoes: ex.repeticoes,
            feito: false
          }));
          await db.insert(execucaoExercicio).values(execucoesData);
        }

        return res.status(201).json(novoGrupo);
      }

      return res.status(400).json({ error: 'Ação inválida' });
    } catch (error: any) {
      console.error('Erro no POST /sessoes:', error);
      return res.status(500).json({ error: 'Erro interno', details: error.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { action } = req.body;
      
      if (action === 'complete_session') {
        const { id } = req.body;
        const [sessaoAtualizada] = await db.update(sessaoTreino)
          .set({ concluida: true, travada: true })
          .where(eq(sessaoTreino.id, id))
          .returning();
        return res.status(200).json(sessaoAtualizada);
      }

      return res.status(400).json({ error: 'Ação inválida' });
    } catch (error: any) {
      console.error('Erro no PATCH /sessoes:', error);
      return res.status(500).json({ error: 'Erro interno', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
