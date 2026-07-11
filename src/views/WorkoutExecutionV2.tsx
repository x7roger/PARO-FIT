import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Check, X } from 'lucide-react';
import { api, SessaoTreino, GrupoMuscular } from '../lib/api';

const DIAS_CURTO = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MAX_GRUPOS_POR_SESSAO = 2;
const USUARIO_TESTE = 'user1'; // Mock user

const getLocalDateString = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

interface Props {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

export function WorkoutExecutionV2({ selectedDay, setSelectedDay }: Props) {
  const todayIndex = new Date().getDay();
  const [sessao, setSessao] = useState<SessaoTreino | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWorkoutLocked, setIsWorkoutLocked] = useState(false);

  // Group selection state
  const [isSelectingGroup, setIsSelectingGroup] = useState(false);
  const [availableGrupos, setAvailableGrupos] = useState<GrupoMuscular[]>([]);

  // Calcula a data exata
  const offset = selectedDay - todayIndex;
  const targetDateString = getLocalDateString(offset);
  const [year, month, day] = targetDateString.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const fetchSession = async () => {
    try {
      const data = await api.getSessao(targetDateString, USUARIO_TESTE);
      setSessao(data);
      if (data?.travada) {
        setIsWorkoutLocked(true);
      } else {
        setIsWorkoutLocked(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSession().finally(() => setLoading(false));
  }, [selectedDay, targetDateString]);

  // Carregar lista de grupos para seleção
  useEffect(() => {
    if (isSelectingGroup) {
      api.getGrupos().then(setAvailableGrupos).catch(console.error);
    }
  }, [isSelectingGroup]);

  const handleAddGroup = async (grupoMuscularId: string) => {
    setIsSelectingGroup(false);
    try {
      let currentSessao = sessao;
      // 1. Ensure session exists
      if (!currentSessao) {
        currentSessao = await api.createSessao(targetDateString, USUARIO_TESTE);
        setSessao(currentSessao);
      }

      // 2. Add group to session
      const newOrder = (currentSessao.grupos?.length || 0) + 1;
      await api.addGroupToSessao(currentSessao.id, grupoMuscularId, newOrder);
      
      // 3. Reload session
      fetchSession();
    } catch (err) {
      console.error('Erro ao adicionar grupo:', err);
    }
  };

  const handleToggle = async (execucaoId: string, atualFeito: boolean) => {
    if (isWorkoutLocked) return;
    
    // Optimistic UI
    if (sessao && sessao.grupos) {
      const newSessao = { ...sessao };
      newSessao.grupos = newSessao.grupos.map(g => ({
        ...g,
        exercicios: g.exercicios.map(e => e.id === execucaoId ? { ...e, feito: !atualFeito } : e)
      }));
      setSessao(newSessao);
    }

    try {
      await api.toggleExecucao(execucaoId, !atualFeito);
    } catch (err) {
      console.error(err);
      fetchSession(); // Revert
    }
  };

  const handleCompleteSession = async () => {
    if (!sessao) return;
    
    if (isWorkoutLocked) {
      // Logic to unlock (not strictly requested, but good UX if accidental lock)
      // We will keep it one-way as requested by 'travada'
      alert('Treino já foi travado e não pode ser editado.');
      return;
    }

    try {
      await api.completeSessao(sessao.id);
      setIsWorkoutLocked(true);
      fetchSession();
    } catch (err) {
      console.error(err);
      alert('Erro ao concluir treino.');
    }
  };

  // Compute what groups are available to add (not already in session)
  const usedGroupIds = sessao?.grupos?.map(g => g.grupoMuscularId) || [];
  const groupsToSelect = availableGrupos.filter(g => !usedGroupIds.includes(g.id));
  const canAddMoreGroups = (sessao?.grupos?.length || 0) < MAX_GRUPOS_POR_SESSAO;

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-12">
      {/* Current Day Header */}
      <div className="sticky top-[52px] md:top-[60px] z-30 bg-background pt-3 pb-1 mb-4 flex flex-col items-center border-b border-surface-variant shadow-sm -mx-margin-mobile px-margin-mobile md:-mx-margin-desktop md:px-margin-desktop">
        <span className="font-label text-label-sm text-on-surface-variant tracking-widest">
          {formattedDate}
        </span>
        
        {/* Ruler Day Selector */}
        <div className="w-full mt-4 overflow-x-auto no-scrollbar relative py-3">
          <div className="flex justify-between min-w-[300px] md:min-w-full px-4">
            {DIAS_CURTO.map((day, i) => (
              <div 
                key={day} 
                onClick={() => setSelectedDay(i)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${selectedDay === i ? 'relative' : 'opacity-50 hover:opacity-100'}`}
              >
                <span className={`font-label text-[10px] ${selectedDay === i ? 'text-primary font-bold' : 'text-on-surface'}`}>{day}</span>
                <div className={`w-[2px] ${selectedDay === i ? 'h-3 bg-primary w-[3px]' : 'h-2 bg-on-surface'}`}></div>
                {selectedDay === i && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-lg">
        {loading && (!sessao || !sessao.grupos) ? (
          <div className="text-center py-8 text-on-surface-variant font-body">Carregando treino...</div>
        ) : (
          <>
            {/* Render Groups and Exercises */}
            {sessao?.grupos?.map((grupo) => (
              <div key={grupo.id} className="bg-surface-container text-on-surface rounded-xl p-6 relative group overflow-hidden">
                <div className="border-b-2 border-surface-variant pb-2 mb-6 flex justify-between items-end">
                  <h3 className="font-headline text-headline-md uppercase font-bold tracking-tight">{grupo.nome}</h3>
                  <span className="font-label text-[10px] tracking-[0.2em] text-on-surface-variant opacity-70">{formattedDate}</span>
                </div>
                
                <div className="space-y-6">
                  {grupo.exercicios.length === 0 ? (
                    <div className="text-center py-4 text-on-surface-variant opacity-70">
                      Nenhum exercício ativo neste grupo.
                    </div>
                  ) : (
                    grupo.exercicios.map((ex) => (
                      <div 
                        key={ex.id}
                        className={`group relative p-3 border rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${ex.feito ? 'border-primary/30 bg-primary/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'border-outline-variant/50 bg-surface hover:border-primary/30 hover:bg-surface-container-lowest'}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className={`font-body text-body-md font-bold uppercase pr-6 transition-colors duration-500 ${ex.feito ? 'text-primary' : 'text-on-surface'}`}>{ex.nome}</h4>
                          
                          {/* High-end Checkmark Toggle */}
                          <div 
                            onClick={(e) => { e.stopPropagation(); handleToggle(ex.id, ex.feito); }}
                            className={`relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full overflow-hidden transition-transform duration-500 group-active:scale-90 cursor-pointer ${isWorkoutLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className={`absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${ex.feito ? 'scale-100 bg-primary' : 'scale-0 bg-transparent'}`}></div>
                            <div className={`absolute inset-0 rounded-full border border-outline-variant transition-opacity duration-300 ${ex.feito ? 'opacity-0' : 'opacity-100 group-hover:border-primary/50'}`}></div>
                            <Check size={14} strokeWidth={3} className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${ex.feito ? 'text-on-primary scale-100 opacity-100 rotate-0' : 'text-transparent scale-50 opacity-0 -rotate-45'}`} />
                          </div>
                        </div>

                        <div className={`grid grid-cols-2 gap-4 border-t border-surface-variant pt-2 transition-opacity ${ex.feito ? 'opacity-50' : 'opacity-100'}`}>
                          <div>
                            <div className="font-label text-[10px] text-on-surface-variant mb-1">SÉRIES</div>
                            <div className="font-body text-body-md">{ex.series}</div>
                          </div>
                          <div>
                            <div className="font-label text-[10px] text-on-surface-variant mb-1">REPS</div>
                            <div className="font-body text-body-md">{ex.repeticoes}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Add Group Section */}
            {!isWorkoutLocked && canAddMoreGroups && !isSelectingGroup && (
              <div className="pt-4 pb-4">
                <button 
                  onClick={() => setIsSelectingGroup(true)}
                  className="w-full h-[60px] border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface-container-low transition-all font-label text-label-sm uppercase font-bold"
                >
                  <Plus size={20} /> ADICIONAR GRUPO MUSCULAR
                </button>
              </div>
            )}

            {isSelectingGroup && (
              <div className="bg-surface-container border border-outline-variant rounded-xl p-4 mt-4 mb-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-2">
                  <h4 className="font-headline text-headline-sm uppercase text-on-surface">Selecione um Grupo</h4>
                  <button onClick={() => setIsSelectingGroup(false)} className="p-1 hover:text-primary"><X size={20}/></button>
                </div>
                <div className="flex flex-col gap-2">
                  {groupsToSelect.length === 0 ? (
                    <div className="text-center py-4 opacity-50">Nenhum grupo novo disponível.</div>
                  ) : (
                    groupsToSelect.map(g => (
                      <button 
                        key={g.id}
                        onClick={() => handleAddGroup(g.id)}
                        className="w-full text-left px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md hover:border-primary hover:text-primary transition-all"
                      >
                        {g.nome}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Finish Workout Button */}
            {sessao?.grupos && sessao.grupos.length > 0 && (
              <div className="pt-8 pb-12 flex justify-center">
                <button 
                  onClick={handleCompleteSession}
                  disabled={isWorkoutLocked}
                  className={`h-[56px] px-8 font-label text-label-sm rounded-lg transition-all flex items-center gap-2 ${isWorkoutLocked ? 'bg-surface-variant text-on-surface opacity-50 cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-opacity-90 active:scale-95'}`}
                >
                  <CheckCircle size={20} />
                  {isWorkoutLocked ? 'TREINO CONCLUÍDO' : 'CONCLUIR TREINO'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
