import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { conclusoes } from '../db/schema.js';
import { sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Busca agrupada por data (quantidade de exercícios feitos em cada dia)
    const db = getDb();
    const statsQuery = await db.select({
      data: conclusoes.data,
      count: sql<number>`count(${conclusoes.id})`
    })
    .from(conclusoes)
    .groupBy(conclusoes.data)
    .orderBy(conclusoes.data);

    // Formatar os dados para o Heatmap (últimos 90 dias)
    const heatmapData: Record<string, number> = {};
    statsQuery.forEach(row => {
      heatmapData[row.data] = Number(row.count);
    });

    // Calcula a Sequência Atual (Streak)
    let streak = 0;
    let currDate = new Date();
    
    // Simplificando o streak: checa se hoje ou ontem tem marcação, e volta no tempo
    while (true) {
      const dateStr = currDate.toISOString().split('T')[0];
      if (heatmapData[dateStr] && heatmapData[dateStr] > 0) {
        streak++;
        currDate.setDate(currDate.getDate() - 1);
      } else {
        // Tolerância se for hoje e a pessoa ainda não treinou (olha pro ontem)
        if (streak === 0 && new Date().toISOString().split('T')[0] === dateStr) {
          currDate.setDate(currDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    // Calcula a consistência da semana atual (Dom a Sáb)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 a 6
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const weekData = Array(7).fill(0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      weekData[i] = heatmapData[dStr] || 0;
    }

    return res.status(200).json({
      streak,
      heatmapData,
      weekData
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar estatísticas' });
  }
}
