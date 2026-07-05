import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Minus } from 'lucide-react';
import { api, Exercicio } from '../lib/api';

const DIAS = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

export function WorkoutEditor() {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Segunda
  const [workouts, setWorkouts] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [nome, setNome] = useState('');
  const [series, setSeries] = useState('4');
  const [reps, setReps] = useState('10-12');
  const [bloco, setBloco] = useState('PEITO');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchWorkouts = async (dia: number) => {
    setLoading(true);
    try {
      const data = await api.getWorkouts(dia);
      setWorkouts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(selectedDay);
  }, [selectedDay]);

  const handleSave = async () => {
    if (!nome.trim() || !bloco.trim()) return;
    try {
      await api.createWorkout({
        diaSemana: selectedDay,
        bloco: bloco.toUpperCase(),
        ordemBloco: 0,
        nome,
        series,
        reps,
        ordem: workouts.length,
      });
      setNome('');
      setIsFormOpen(false);
      fetchWorkouts(selectedDay); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  // Group by block
  const groupedWorkouts = workouts.reduce((acc, curr) => {
    if (!acc[curr.bloco]) acc[curr.bloco] = [];
    acc[curr.bloco].push(curr);
    return acc;
  }, {} as Record<string, Exercicio[]>);

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-12">
      <h2 className="font-headline text-headline-md text-on-surface uppercase tracking-widest mb-6">CONFIGURAÇÕES</h2>
      
      {/* Settings Tabs */}
      <div className="w-full mb-8">
        <div className="flex border-b border-surface-variant overflow-x-auto no-scrollbar mb-6">
          {DIAS.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={`font-label text-label-sm uppercase px-4 py-3 whitespace-nowrap transition-colors ${
                selectedDay === idx ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
          <h2 className="font-label text-label-sm text-on-surface-variant uppercase">BLOCOS ATIVOS - {DIAS[selectedDay]}</h2>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="font-label text-label-sm text-primary flex items-center gap-1 hover:opacity-80 uppercase"
          >
            <Plus size={14} /> ADICIONAR EXERCÍCIO
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-on-surface-variant font-body">Carregando...</div>
        ) : Object.keys(groupedWorkouts).length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant font-body border border-dashed border-outline-variant rounded-xl">
            Nenhum exercício cadastrado para {DIAS[selectedDay].toLowerCase()}.
          </div>
        ) : (
          Object.entries(groupedWorkouts).map(([blocoName, exercises]) => (
            <div key={blocoName} className="bg-surface-container text-on-surface border border-outline-variant rounded-xl overflow-hidden mb-6">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-surface-variant bg-surface">
                <h3 className="font-body text-body-md font-bold uppercase tracking-widest">{blocoName}</h3>
                <div className="flex gap-4 text-on-surface-variant">
                  <button className="hover:text-primary"><Edit2 size={18} /></button>
                  <button className="hover:text-error"><Trash2 size={18} /></button>
                </div>
              </div>

              {/* Exercise List */}
              <div className="bg-surface-container-lowest">
                {exercises.map((ex) => (
                  <div key={ex.id} className="flex border-b border-surface-variant hover:bg-surface-container-low transition-colors">
                    <div className="flex-1 p-4 flex items-center gap-3 border-r border-surface-variant">
                      <div className="grid grid-cols-2 grid-rows-3 gap-0.5 opacity-30">
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                        <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                      </div>
                      <span className="font-body text-body-md">{ex.nome}</span>
                    </div>
                    <div className="w-24 p-4 flex items-center justify-center font-body text-body-md text-on-surface-variant">
                      {ex.series}x {ex.reps}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Configuration Form */}
        {isFormOpen && (
          <div className="border-l-4 border-primary pl-4 py-2 mt-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="font-label text-label-sm text-on-surface uppercase border-b border-surface-variant pb-2 mb-6">
                CONFIGURAR EXERCÍCIO
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">BLOCO (Ex: PEITO, COSTAS)</label>
                  <input 
                    type="text" 
                    value={bloco}
                    onChange={(e) => setBloco(e.target.value)}
                    className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase"
                  />
                </div>

                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">NOME DO EXERCÍCIO</label>
                  <input 
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Supino Reto c/ Barra"
                    className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">SÉRIES ALVO</label>
                  <div className="flex border border-outline-variant rounded-lg h-12 overflow-hidden bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <button 
                      onClick={() => setSeries(String(Math.max(1, parseInt(series) - 1)))}
                      className="w-12 h-full flex items-center justify-center border-r border-outline-variant hover:bg-surface-variant text-on-surface transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <input 
                      type="text" 
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      className="flex-1 h-full text-center font-display text-[24px] focus:outline-none"
                    />
                    <button 
                      onClick={() => setSeries(String(parseInt(series) + 1))}
                      className="w-12 h-full flex items-center justify-center border-l border-outline-variant hover:bg-surface-variant text-on-surface transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">FAIXA DE REPETIÇÕES</label>
                  <input 
                    type="text" 
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="Ex: 10-12"
                    className="w-full h-12 px-4 text-center bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="border-t border-surface-variant pt-6 mt-6 flex gap-4">
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 h-12 border border-outline-variant rounded-lg font-label text-label-sm uppercase hover:bg-surface-variant transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!nome || !bloco}
                    className="flex-1 h-12 bg-primary text-on-primary rounded-lg font-label text-label-sm uppercase hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    SALVAR EXERCÍCIO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
