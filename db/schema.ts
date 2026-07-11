import { pgTable, uuid, integer, text, timestamp, date, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';



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
  nome: text('nome').notNull(),
  series: integer('series').notNull(),
  repeticoes: text('repeticoes').notNull(),
  feito: boolean('feito').notNull().default(false),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});
