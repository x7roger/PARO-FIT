const BASE_URL = '/api';

export type Exercicio = {
  id: string;
  diaSemana: number;
  bloco: string;
  ordemBloco: number;
  nome: string;
  series: string;
  reps: string;
  ordem: number;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Conclusao = {
  id: string;
  exercicioId: string;
  data: string;
  concluidoEm?: string;
  marcadoPor: string | null;
};

export const api = {
  getWorkouts: async (diaSemana?: number): Promise<Exercicio[]> => {
    const url = diaSemana !== undefined ? `${BASE_URL}/workouts?diaSemana=${diaSemana}` : `${BASE_URL}/workouts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar exercícios');
    return res.json();
  },

  createWorkout: async (data: Omit<Exercicio, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const res = await fetch(`${BASE_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar exercício');
    return res.json();
  },

  updateWorkout: async (id: string, data: Partial<Exercicio>) => {
    const res = await fetch(`${BASE_URL}/workouts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar exercício');
    return res.json();
  },

  deleteWorkout: async (id: string) => {
    const res = await fetch(`${BASE_URL}/workouts?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao deletar exercício');
    return res.json();
  },

  reorderWorkouts: async (reorders: { id: string, ordem: number }[]) => {
    const res = await fetch(`${BASE_URL}/workouts`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reorders }),
    });
    if (!res.ok) throw new Error('Erro ao reordenar exercícios');
    return res.json();
  },

  getConclusions: async (data?: string): Promise<Conclusao[]> => {
    const url = data ? `${BASE_URL}/conclusions?data=${data}` : `${BASE_URL}/conclusions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar conclusões');
    return res.json();
  },

  toggleConclusion: async (exercicioId: string, data: string, marcadoPor?: string) => {
    const res = await fetch(`${BASE_URL}/conclusions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercicioId, data, marcadoPor }),
    });
    if (!res.ok) throw new Error('Erro ao alternar conclusão');
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Erro ao buscar estatísticas');
    return res.json();
  }
};
