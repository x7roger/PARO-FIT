import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import { grupoMuscular, exercicio } from '../db/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const biblioteca = {
  "Peitorais (Peito)": [
    { "nome": "Supino reto com barra", "series": 4, "repeticoes": "6-12" },
    { "nome": "Supino inclinado com halteres", "series": 4, "repeticoes": "8-12" },
    { "nome": "Supino inclinado com barra", "series": 4, "repeticoes": "6-12" },
    { "nome": "Supino declinado", "series": 3, "repeticoes": "6-10" },
    { "nome": "Crucifixo com halteres (plano)", "series": 3, "repeticoes": "8-15" },
    { "nome": "Crucifixo inclinado com halteres", "series": 3, "repeticoes": "8-15" },
    { "nome": "Peck-deck / Fly máquina", "series": 3, "repeticoes": "10-15" },
    { "nome": "Cross-over / cabos", "series": 3, "repeticoes": "10-15" },
    { "nome": "Mergulho nas paralelas (ênfase peito)", "series": 3, "repeticoes": "6-12" },
    { "nome": "Flexão de braço (padrão/declinada)", "series": 3, "repeticoes": "10-20" }
  ],
  "Dorsais (Costas)": [
    { "nome": "Barra fixa (pull-up)", "series": 4, "repeticoes": "6-12" },
    { "nome": "Puxada frontal na polia (lat pulldown)", "series": 4, "repeticoes": "8-12" },
    { "nome": "Remada curvada com barra", "series": 4, "repeticoes": "6-10" },
    { "nome": "Remada unilateral com halter", "series": 3, "repeticoes": "8-12" },
    { "nome": "Remada sentado no cabo", "series": 3, "repeticoes": "8-12" },
    { "nome": "Remada T-bar", "series": 3, "repeticoes": "6-10" },
    { "nome": "Pullover com halter ou máquina", "series": 3, "repeticoes": "8-12" },
    { "nome": "Peso morto convencional", "series": 3, "repeticoes": "4-6 / 6-8" },
    { "nome": "Peso morto romeno", "series": 3, "repeticoes": "6-10" },
    { "nome": "Face pull", "series": 3, "repeticoes": "12-15" }
  ],
  "Deltoides (Ombros)": [
    { "nome": "Desenvolvimento militar com barra", "series": 4, "repeticoes": "6-10" },
    { "nome": "Desenvolvimento com halteres", "series": 4, "repeticoes": "8-12" },
    { "nome": "Arnold press", "series": 3, "repeticoes": "8-12" },
    { "nome": "Elevação lateral com halteres", "series": 3, "repeticoes": "10-15" },
    { "nome": "Elevação frontal com halteres", "series": 3, "repeticoes": "8-12" },
    { "nome": "Elevação posterior (reverse fly)", "series": 3, "repeticoes": "10-15" },
    { "nome": "Remada alta (upright row)", "series": 3, "repeticoes": "8-12" },
    { "nome": "Elevação lateral em cabo", "series": 3, "repeticoes": "10-15" },
    { "nome": "Desenvolvimento na máquina / Smith", "series": 3, "repeticoes": "8-12" },
    { "nome": "Face pull", "series": 3, "repeticoes": "12-15" }
  ],
  "Bíceps": [
    { "nome": "Rosca direta com barra", "series": 4, "repeticoes": "8-12" },
    { "nome": "Rosca alternada com halteres", "series": 3, "repeticoes": "8-12" },
    { "nome": "Rosca martelo", "series": 3, "repeticoes": "8-12" },
    { "nome": "Rosca concentrada", "series": 3, "repeticoes": "8-10" },
    { "nome": "Rosca scott / banco inclinado", "series": 3, "repeticoes": "8-12" },
    { "nome": "Rosca 21", "series": 3, "repeticoes": "21s" },
    { "nome": "Rosca com barra EZ", "series": 3, "repeticoes": "8-12" },
    { "nome": "Rosca inclinada com halteres", "series": 3, "repeticoes": "8-12" },
    { "nome": "Rosca no cabo", "series": 3, "repeticoes": "10-15" },
    { "nome": "Rosca isométrica", "series": 3, "repeticoes": "8-12" }
  ],
  "Tríceps (Braços)": [
    { "nome": "Tríceps testa", "series": 4, "repeticoes": "8-12" },
    { "nome": "Tríceps no pulley", "series": 4, "repeticoes": "10-15" },
    { "nome": "Mergulho em paralelas", "series": 3, "repeticoes": "6-12" },
    { "nome": "Tríceps overhead", "series": 3, "repeticoes": "8-12" },
    { "nome": "Tríceps kickback", "series": 3, "repeticoes": "10-15" },
    { "nome": "Tríceps supinado", "series": 3, "repeticoes": "10-15" },
    { "nome": "Tríceps com barra EZ", "series": 3, "repeticoes": "8-12" },
    { "nome": "Tríceps unilateral no cabo", "series": 3, "repeticoes": "10-15" },
    { "nome": "Bench dip", "series": 3, "repeticoes": "8-15" },
    { "nome": "Close-grip bench press", "series": 3, "repeticoes": "6-10" }
  ],
  "Quadríceps e Glúteos": [
    { "nome": "Agachamento livre", "series": 4, "repeticoes": "6-10" },
    { "nome": "Agachamento frontal", "series": 3, "repeticoes": "6-10" },
    { "nome": "Leg press", "series": 4, "repeticoes": "8-15" },
    { "nome": "Extensão de pernas", "series": 3, "repeticoes": "10-15" },
    { "nome": "Avanço / Lunge", "series": 3, "repeticoes": "8-12" },
    { "nome": "Passada búlgara", "series": 3, "repeticoes": "8-12" },
    { "nome": "Hack squat", "series": 3, "repeticoes": "8-12" },
    { "nome": "Agachamento sumô", "series": 3, "repeticoes": "6-10" },
    { "nome": "Step-up", "series": 3, "repeticoes": "8-12" }
  ],
  "Posterior de perna e Glúteos": [
    { "nome": "Glute bridge", "series": 4, "repeticoes": "6-12" },
    { "nome": "Peso morto romeno (stiff)", "series": 4, "repeticoes": "6-12" },
    { "nome": "Levantamento terra sumô", "series": 3, "repeticoes": "6-10" },
    { "nome": "Good mornings", "series": 3, "repeticoes": "8-12" },
    { "nome": "Flexora deitado", "series": 3, "repeticoes": "8-12" },
    { "nome": "Kettlebell swing", "series": 3, "repeticoes": "12-20" }
  ],
  "Abdomem": [
    { "nome": "Prancha", "series": 3, "repeticoes": "30-90s" },
    { "nome": "Prancha lateral", "series": 3, "repeticoes": "30-60s" },
    { "nome": "Elevação de pernas", "series": 3, "repeticoes": "8-15" },
    { "nome": "Ab wheel", "series": 3, "repeticoes": "8-15" },
    { "nome": "Crunch tradicional", "series": 3, "repeticoes": "15-25" },
    { "nome": "Reverse crunch", "series": 3, "repeticoes": "12-20" },
    { "nome": "Russian twist", "series": 3, "repeticoes": "12-20" },
    { "nome": "Mountain climbers", "series": 3, "repeticoes": "30-60s" }
  ]
};

async function main() {
  console.log('Iniciando seed de exercícios...');
  
  // Limpar tabela exercicio primeiro
  await db.delete(exercicio);
  console.log('Exercícios antigos removidos.');

  const gruposCadastrados = await db.select().from(grupoMuscular);

  for (const [nomeOriginal, exs] of Object.entries(biblioteca)) {
    // Tentar achar o grupo no banco
    // A lista atual do banco é:
    // 1. Peitorais (Peito)
    // 2. Dorsais (Costas)
    // 3. Deltoides (Ombros)
    // 4. Bíceps
    // 5. Tríceps (Braços)
    // 6. Quadríceps e Glúteos
    // 7. Posterior de perna e Glúteos
    // 8. Abdomem
    
    // O nomeOriginal bate com a lista que ele passou no Prompt 1 retificado
    const grupoEncontrado = gruposCadastrados.find(g => g.nome === nomeOriginal);
    
    if (grupoEncontrado) {
      if (exs.length > 0) {
        const valoresParaInserir = exs.map(e => ({
          grupoMuscularId: grupoEncontrado.id,
          nome: e.nome,
          series: e.series,
          repeticoes: e.repeticoes,
          ativo: false
        }));

        await db.insert(exercicio).values(valoresParaInserir);
        console.log(`+ Inseridos ${exs.length} exercícios em '${nomeOriginal}'`);
      } else {
        console.log(`- Nenhum exercício para inserir em '${nomeOriginal}'`);
      }
    } else {
      console.error(`Grupo muscular '${nomeOriginal}' não encontrado no banco de dados!`);
    }
  }

  console.log('Seed concluído com sucesso!');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
