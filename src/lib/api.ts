const BASE_URL = '/api';

export type GrupoMuscular = {
  id: string;
  nome: string;
  ordem: number;
  criadoEm?: string;
};

export type ExercicioV2 = {
  id: string;
  grupoMuscularId: string;
  nome: string;
  series: number;
  repeticoes: string;
  ativo: boolean;
  criadoEm?: string;
};

export type ExecucaoExercicio = {
  id: string;
  sessaoTreinoGrupoId: string;
  exercicioId: string;
  feito: boolean;
  nome: string;
  series: number;
  repeticoes: string;
};

export type SessaoTreinoGrupo = {
  id: string;
  sessaoTreinoId: string;
  grupoMuscularId: string;
  ordem: number;
  nome: string; // group name
  exercicios: ExecucaoExercicio[];
};

export type SessaoTreino = {
  id: string;
  usuarioId: string;
  data: string;
  concluida: boolean;
  travada: boolean;
  criadoEm?: string;
  grupos?: SessaoTreinoGrupo[];
};

export const api = {
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Erro ao buscar estatísticas');
    return res.json();
  },

  // Novos endpoints (V2 - Grupos Musculares)
  getGrupos: async (): Promise<GrupoMuscular[]> => {
    const res = await fetch(`${BASE_URL}/grupos`);
    if (!res.ok) throw new Error('Erro ao buscar grupos');
    return res.json();
  },

  getExercicios: async (grupoMuscularId: string): Promise<ExercicioV2[]> => {
    const res = await fetch(`${BASE_URL}/exercicio?grupoMuscularId=${grupoMuscularId}`);
    if (!res.ok) throw new Error('Erro ao buscar exercícios do grupo');
    return res.json();
  },

  createExercicio: async (data: Omit<ExercicioV2, 'id' | 'criadoEm'>) => {
    const res = await fetch(`${BASE_URL}/exercicio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar exercício');
    return res.json();
  },

  updateExercicio: async (id: string, data: Partial<ExercicioV2>) => {
    const res = await fetch(`${BASE_URL}/exercicio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar exercício');
    return res.json();
  },

  toggleExercicioAtivo: async (id: string, ativo: boolean) => {
    const res = await fetch(`${BASE_URL}/exercicio`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo }),
    });
    if (!res.ok) throw new Error('Erro ao alternar status do exercício');
    return res.json();
  },

  deleteExercicio: async (id: string) => {
    const res = await fetch(`${BASE_URL}/exercicio?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao deletar exercício');
    return res.json();
  },

  // Sessões de Treino (V2)
  getSessao: async (data: string, usuarioId: string = 'user1'): Promise<SessaoTreino | null> => {
    const res = await fetch(`${BASE_URL}/sessoes?data=${data}&usuarioId=${usuarioId}`);
    if (!res.ok) throw new Error('Erro ao buscar sessão');
    return res.json();
  },

  createSessao: async (data: string, usuarioId: string = 'user1'): Promise<SessaoTreino> => {
    const res = await fetch(`${BASE_URL}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_session', data, usuarioId }),
    });
    if (!res.ok) throw new Error('Erro ao criar sessão');
    return res.json();
  },

  addGroupToSessao: async (sessaoTreinoId: string, grupoMuscularId: string, ordem: number): Promise<any> => {
    const res = await fetch(`${BASE_URL}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_group', sessaoTreinoId, grupoMuscularId, ordem }),
    });
    if (!res.ok) throw new Error('Erro ao adicionar grupo à sessão');
    return res.json();
  },

  deleteGroupFromSessao: async (sessaoTreinoGrupoId: string): Promise<any> => {
    const res = await fetch(`${BASE_URL}/sessoes`, {
      method: 'POST', // Using POST with action for simplicity as per existing pattern
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_group', sessaoTreinoGrupoId }),
    });
    if (!res.ok) throw new Error('Erro ao deletar grupo da sessão');
    return res.json();
  },

  completeSessao: async (id: string): Promise<SessaoTreino> => {
    const res = await fetch(`${BASE_URL}/sessoes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_session', id }),
    });
    if (!res.ok) throw new Error('Erro ao concluir sessão');
    return res.json();
  },

  unlockSessao: async (id: string): Promise<SessaoTreino> => {
    const res = await fetch(`${BASE_URL}/sessoes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unlock_session', id }),
    });
    if (!res.ok) throw new Error('Erro ao destravar sessão');
    return res.json();
  },

  toggleExecucao: async (id: string, feito: boolean): Promise<ExecucaoExercicio> => {
    const res = await fetch(`${BASE_URL}/execucao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, feito }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar execução');
    return res.json();
  }
};
