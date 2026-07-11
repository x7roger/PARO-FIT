import { pgTable, uuid, integer, text, timestamp, date, boolean } from 'drizzle-orm/pg-core';
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
  peso: integer('peso').notNull().default(0),
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

export const grupoMuscular = pgTable('grupo_muscular', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: text('nome').notNull(),
  ordem: integer('ordem').notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const exercicio = pgTable('exercicio', {
  id: uuid('id').primaryKey().defaultRandom(),
  grupoMuscularId: uuid('grupo_muscular_id')
    .notNull()
    .references(() => grupoMuscular.id, { onDelete: 'cascade' }),
  nome: text('nome').notNull(),
  series: integer('series').notNull(),
  repeticoes: text('repeticoes').notNull(),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const sessaoTreino = pgTable('sessao_treino', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: text('usuario_id').notNull(), // Referência ao usuário (Rogério ou Patrícia)
  data: date('data').notNull(),
  concluida: boolean('concluida').notNull().default(false),
  travada: boolean('travada').notNull().default(false),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const sessaoTreinoGrupo = pgTable('sessao_treino_grupo', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessaoTreinoId: uuid('sessao_treino_id')
    .notNull()
    .references(() => sessaoTreino.id, { onDelete: 'cascade' }),
  grupoMuscularId: uuid('grupo_muscular_id')
    .notNull()
    .references(() => grupoMuscular.id, { onDelete: 'cascade' }),
  ordem: integer('ordem').notNull(),
});

export const execucaoExercicio = pgTable('execucao_exercicio', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessaoTreinoGrupoId: uuid('sessao_treino_grupo_id')
    .notNull()
    .references(() => sessaoTreinoGrupo.id, { onDelete: 'cascade' }),
  exercicioId: uuid('exercicio_id')
    .notNull()
    .references(() => exercicio.id, { onDelete: 'cascade' }),
  feito: boolean('feito').notNull().default(false),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});
