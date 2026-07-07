import { useState, useEffect } from 'react';
import { Plus, Minus, CheckCircle, Check } from 'lucide-react';
import { api, Exercicio, Conclusao } from '../lib/api';

const DIAS_CURTO = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const getLocalDateString = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

interface Props {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

export function WorkoutExecution({ selectedDay, setSelectedDay }: Props) {
  const todayIndex = new Date().getDay();
  const [workouts, setWorkouts] = useState<Exercicio[]>([]);
  const [conclusions, setConclusions] = useState<Conclusao[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWorkoutLocked, setIsWorkoutLocked] = useState(false);

  // Calcula a data exata em 'YYYY-MM-DD' baseada no dia da semana selecionado (na mesma semana)
  const offset = selectedDay - todayIndex;
  const targetDateString = getLocalDateString(offset);
  
  // Formatar data para DD/MM/YYYY
  const [year, month, day] = targetDateString.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const fetchWorkoutsAndConclusions = async () => {
    try {
      const [workoutsData, conclusionsData] = await Promise.all([
        api.getWorkouts(selectedDay),
        api.getConclusions(targetDateString)
      ]);
      setWorkouts(workoutsData);
      setConclusions(conclusionsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchWorkoutsAndConclusions().finally(() => setLoading(false));
  }, [selectedDay, targetDateString]);

  // Polling de 10 em 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWorkoutsAndConclusions();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedDay, targetDateString]);

  const handleUpdatePeso = async (exercicioId: string, delta: number) => {
    const ex = workouts.find(w => w.id === exercicioId);
    if (!ex) return;
    
    const currentPeso = Number(ex.peso) || 0;
    const newPeso = Math.max(0, currentPeso + delta);
    
    // Optimistic UI update
    setWorkouts(prev => prev.map(w => w.id === exercicioId ? { ...w, peso: newPeso } : w));
    
    try {
      await api.updateWorkout(exercicioId, { peso: newPeso });
    } catch (err) {
      console.error('Erro ao atualizar peso:', err);
      fetchWorkoutsAndConclusions(); // Revert on failure
    }
  };

  const handleToggle = async (exercicioId: string) => {
    // Optimistic UI update
    const isCompleted = conclusions.some(c => c.exercicioId === exercicioId);
    if (isCompleted) {
      setConclusions(prev => prev.filter(c => c.exercicioId !== exercicioId));
    } else {
      setConclusions(prev => [...prev, { id: 'temp', exercicioId, data: targetDateString, marcadoPor: null }]);
    }

    try {
      await api.toggleConclusion(exercicioId, targetDateString);
      // O próximo polling vai garantir que o estado real do banco esteja correto
    } catch (err) {
      console.error(err);
      fetchWorkoutsAndConclusions(); // Revert on error
    }
  };

  const groupedWorkouts = workouts.reduce((acc, curr) => {
    if (!acc[curr.bloco]) acc[curr.bloco] = [];
    acc[curr.bloco].push(curr);
    return acc;
  }, {} as Record<string, Exercicio[]>);

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
        {loading && workouts.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant font-body">Carregando treinos...</div>
        ) : Object.keys(groupedWorkouts).length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant font-body border border-dashed border-outline-variant rounded-xl mx-4">
            Nenhum treino configurado para hoje. Vá em configurações para montar!
          </div>
        ) : (
          Object.entries(groupedWorkouts).map(([blocoName, exercises]) => (
            <div key={blocoName} className="bg-surface-container text-on-surface rounded-xl p-6 relative group overflow-hidden">
              <div className="border-b-2 border-surface-variant pb-2 mb-6 flex justify-between items-end">
                <h3 className="font-headline text-headline-md uppercase font-bold tracking-tight">{blocoName}</h3>
                <span className="font-label text-[10px] tracking-[0.2em] text-on-surface-variant opacity-70">{formattedDate}</span>
              </div>
              
              <div className="space-y-6">
                {exercises.map((ex) => {
                  const isCompleted = conclusions.some(c => c.exercicioId === ex.id);

                  return (
                    <div 
                      key={ex.id}
                      className={`group relative p-3 border rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isCompleted ? 'border-primary/30 bg-primary/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'border-outline-variant/50 bg-surface hover:border-primary/30 hover:bg-surface-container-lowest'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className={`font-body text-body-md font-bold uppercase pr-6 transition-colors duration-500 ${isCompleted ? 'text-primary' : 'text-on-surface'}`}>{ex.nome}</h4>
                        
                        {/* High-end Checkmark Toggle */}
                        <div 
                          onClick={(e) => { e.stopPropagation(); if (!isWorkoutLocked) handleToggle(ex.id); }}
                          className={`relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full overflow-hidden transition-transform duration-500 group-active:scale-90 cursor-pointer ${isWorkoutLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* Background fill that scales up */}
                          <div className={`absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isCompleted ? 'scale-100 bg-primary' : 'scale-0 bg-transparent'}`}></div>
                          
                          {/* Unchecked ring */}
                          <div className={`absolute inset-0 rounded-full border border-outline-variant transition-opacity duration-300 ${isCompleted ? 'opacity-0' : 'opacity-100 group-hover:border-primary/50'}`}></div>
                          
                          {/* Check Icon */}
                          <Check size={14} strokeWidth={3} className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isCompleted ? 'text-on-primary scale-100 opacity-100 rotate-0' : 'text-transparent scale-50 opacity-0 -rotate-45'}`} />
                        </div>
                      </div>

                      <div className={`grid grid-cols-4 gap-2 md:gap-4 border-t border-surface-variant pt-2 transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="col-span-1 font-label text-[10px] text-on-surface-variant">SÉRIES</div>
                        <div className="col-span-1 font-label text-[10px] text-on-surface-variant">REPS</div>
                        <div className="col-span-2 font-label text-[10px] text-on-surface-variant">PESO (KG)</div>
                        
                        <div className="col-span-1 font-body text-body-md">{ex.series}</div>
                        <div className="col-span-1 font-body text-body-md">{ex.reps}</div>
                        <div className="col-span-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleUpdatePeso(ex.id, -1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors active:bg-surface-container-high text-primary"><Minus size={16} /></button>
                          <input 
                            type="text" 
                            value={ex.peso || 0}
                            readOnly
                            className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-headline text-body-lg text-primary focus:outline-none" 
                          />
                          <button onClick={() => handleUpdatePeso(ex.id, 1)} className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors active:bg-surface-container-high text-primary"><Plus size={16} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Finish Workout Button */}
        {workouts.length > 0 && (
          <div className="pt-8 pb-12 flex justify-center">
            <button 
              onClick={() => setIsWorkoutLocked(!isWorkoutLocked)}
              className={`h-[56px] px-8 font-label text-label-sm rounded-lg hover:bg-opacity-90 transition-opacity active:scale-95 flex items-center gap-2 ${isWorkoutLocked ? 'bg-surface-variant text-on-surface' : 'bg-primary text-on-primary'}`}
            >
              <CheckCircle size={20} />
              {isWorkoutLocked ? 'DESBLOQUEAR TREINO' : 'CONCLUIR TREINO'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
