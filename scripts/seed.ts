import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { exercicios } from '../db/schema';
import * as dotenv from 'dotenv';

// Carrega .env do root do projeto (assumindo execução a partir da raiz)
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedData = [
  // SEGUNDA-FEIRA (1)
  { diaSemana: 1, bloco: "Peito", nome: "Supino reto com halteres", series: "4", reps: "10", ordem: 1 },
  { diaSemana: 1, bloco: "Peito", nome: "Supino inclinado com barra", series: "4", reps: "10", ordem: 2 },
  { diaSemana: 1, bloco: "Peito", nome: "Crucifixo reto (peck deck)", series: "4", reps: "10", ordem: 3 },
  { diaSemana: 1, bloco: "Peito", nome: "Cross no cabo", series: "4", reps: "10", ordem: 4 },
  { diaSemana: 1, bloco: "Triceps", nome: "pulldow na polia (tríceps na polia)", series: "4", reps: "10", ordem: 5 },
  { diaSemana: 1, bloco: "Triceps", nome: "Tríceps testa com barra", series: "4", reps: "10", ordem: 6 },
  { diaSemana: 1, bloco: "Triceps", nome: "Tríceps francês com barra", series: "4", reps: "10", ordem: 7 },

  // TERÇA-FEIRA (2)
  { diaSemana: 2, bloco: "Perna - Quadriceps", nome: "Agachamento livre com barra", series: "4", reps: "10", ordem: 1 },
  { diaSemana: 2, bloco: "Perna - Quadriceps", nome: "Agachamento front", series: "4", reps: "10", ordem: 2 },
  { diaSemana: 2, bloco: "Perna - Quadriceps", nome: "Leg press 45", series: "4", reps: "10", ordem: 3 },
  { diaSemana: 2, bloco: "Perna - Quadriceps", nome: "Cadeira extensora", series: "4", reps: "10", ordem: 4 },
  { diaSemana: 2, bloco: "Perna - Quadriceps", nome: "terra", series: "4", reps: "10", ordem: 5 },

  // QUARTA-FEIRA (3)
  { diaSemana: 3, bloco: "Ombro", nome: "Desenvolvimento com altere", series: "4", reps: "10", ordem: 1 },
  { diaSemana: 3, bloco: "Ombro", nome: "Elevação lateral com halteres", series: "4", reps: "10", ordem: 2 },
  { diaSemana: 3, bloco: "Ombro", nome: "Elevação lateral na máquina", series: "4", reps: "10", ordem: 3 },
  { diaSemana: 3, bloco: "Ombro", nome: "Ele frontal", series: "4", reps: "10", ordem: 4 },
  { diaSemana: 3, bloco: "Ombro", nome: "Crucifixo inverso (posterior)", series: "4", reps: "10", ordem: 5 },

  // QUINTA-FEIRA (4)
  { diaSemana: 4, bloco: "Costas", nome: "Puxada baixa triangulo (pull-up)", series: "4", reps: "10", ordem: 1 },
  { diaSemana: 4, bloco: "Costas", nome: "Puxada alta frontal", series: "4", reps: "10", ordem: 2 },
  { diaSemana: 4, bloco: "Costas", nome: "Remada curvada com barra", series: "4", reps: "10", ordem: 3 },
  { diaSemana: 4, bloco: "Costas", nome: "Pulldow no cabo", series: "4", reps: "10", ordem: 4 },
  { diaSemana: 4, bloco: "Biceps", nome: "Rosca direta com barra", series: "4", reps: "10", ordem: 5 },
  { diaSemana: 4, bloco: "Biceps", nome: "Rosca direta com halteres", series: "4", reps: "10", ordem: 6 },
  { diaSemana: 4, bloco: "Biceps", nome: "Rosca scott", series: "4", reps: "10", ordem: 7 },

  // SEXTA-FEIRA (5)
  { diaSemana: 5, bloco: "perna - posterior", nome: "Levantamento terra (stiff)", series: "4", reps: "10", ordem: 1 },
  { diaSemana: 5, bloco: "perna - posterior", nome: "Levantamento terra", series: "4", reps: "10", ordem: 2 },
  { diaSemana: 5, bloco: "perna - posterior", nome: "Flexora de pernas (máquina)", series: "4", reps: "10", ordem: 3 },
  { diaSemana: 5, bloco: "perna - posterior", nome: "Afundo", series: "4", reps: "10", ordem: 4 },
];

async function main() {
  console.log("Iniciando carga de dados (seed)...");
  try {
    for (const data of seedData) {
      await db.insert(exercicios).values(data);
      console.log(`✅ Inserido: ${data.nome} (${data.bloco}) no dia ${data.diaSemana}`);
    }
    console.log("Carga finalizada com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro durante o seed:", err);
    process.exit(1);
  }
}

main();
