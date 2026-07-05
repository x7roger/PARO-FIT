import { pgTable, uuid, integer, text, timestamp, date } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const exercicios = pgTable('exercicios', {
  id: uuid('id').primaryKey().defaultRandom(),
  diaSemana: integer('dia_semana').notNull(), // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  bloco: text('bloco').notNull(),
  ordemBloco: integer('ordem_bloco').notNull().default(0),
  nome: text('nome').notNull(),
  series: text('series').notNull(),
  reps: text('reps').notNull(),
  ordem: integer('ordem').notNull().default(0),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
});

export const conclusoes = pgTable('conclusoes', {
  id: uuid('id').primaryKey().defaultRandom(),
  exercicioId: uuid('exercicio_id')
    .notNull()
    .references(() => exercicios.id, { onDelete: 'cascade' }),
  data: date('data').notNull(), // Formato 'YYYY-MM-DD'
  concluidoEm: timestamp('concluido_em').defaultNow().notNull(),
  marcadoPor: text('marcado_por'), // opcional: 'Rogério' ou 'Patrícia'
});
