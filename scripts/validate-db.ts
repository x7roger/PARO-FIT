import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { grupoMuscular, exercicio } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Validando grupos musculares...");
  const grupos = await db.select().from(grupoMuscular).orderBy(grupoMuscular.ordem);
  console.log(`Total de grupos: ${grupos.length}`);
  grupos.forEach(g => console.log(`${g.ordem}. ${g.nome}`));

  console.log("\nValidando exercício de teste e relacionamento (FK)...");
  const exercicios = await db
    .select({
      exercicioNome: exercicio.nome,
      series: exercicio.series,
      repeticoes: exercicio.repeticoes,
      grupoNome: grupoMuscular.nome
    })
    .from(exercicio)
    .innerJoin(grupoMuscular, eq(exercicio.grupoMuscularId, grupoMuscular.id));

  console.log(`Total de exercícios encontrados: ${exercicios.length}`);
  exercicios.forEach(ex => {
    console.log(`- ${ex.exercicioNome} (${ex.series}x ${ex.repeticoes}) -> Pertence ao grupo: ${ex.grupoNome}`);
  });
  
  process.exit(0);
}

main();
