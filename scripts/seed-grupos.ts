import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { grupoMuscular, exercicio } from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const gruposData = [
  { nome: "Peitorais (Peito)", ordem: 1 },
  { nome: "Dorsais (Costas)", ordem: 2 },
  { nome: "Deltoides (Ombros)", ordem: 3 },
  { nome: "Bíceps", ordem: 4 },
  { nome: "Tríceps (Braços)", ordem: 5 },
  { nome: "Quadríceps e Glúteos", ordem: 6 },
  { nome: "Posterior de perna e Glúteos", ordem: 7 },
  { nome: "Abdomem", ordem: 8 },
];

async function main() {
  console.log("Iniciando seed de grupos musculares...");
  try {
    // Limpar tabela antes de inserir
    await db.delete(grupoMuscular);
    console.log("Tabela grupo_muscular limpa.");

    for (const data of gruposData) {
      const [inserted] = await db.insert(grupoMuscular).values(data).returning();
      console.log(`✅ Grupo inserido: ${inserted.nome} (ID: ${inserted.id})`);
      
      // Inserir um exercício de teste em Peitorais para validação das FKs
      if (inserted.ordem === 1) {
        const [insertedEx] = await db.insert(exercicio).values({
          grupoMuscularId: inserted.id,
          nome: "Supino Reto (Teste FK)",
          series: 4,
          repeticoes: "8-12",
          ativo: true
        }).returning();
        console.log(`✅ Exercício teste inserido: ${insertedEx.nome} (ID: ${insertedEx.id}) no grupo ${inserted.nome}`);
      }
    }
    console.log("Seed de grupos finalizado com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro durante o seed de grupos:", err);
    process.exit(1);
  }
}

main();
