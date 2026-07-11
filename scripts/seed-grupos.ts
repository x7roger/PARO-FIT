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
  { nome: "Bíceps e Tríceps (Braços)", ordem: 4 },
  { nome: "Quadríceps, Isquiotibiais e Glúteos (Pernas)", ordem: 5 },
  { nome: "Gastrocnêmio (Panturrilhas)", ordem: 6 },
  { nome: "Abdominais (Core)", ordem: 7 },
];

async function main() {
  console.log("Iniciando seed de grupos musculares...");
  try {
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
