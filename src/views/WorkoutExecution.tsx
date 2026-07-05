import { useState, useEffect } from 'react';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import { api, Exercicio, Conclusao } from '../lib/api';

const DIAS_CURTO = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const getLocalDateString = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export function WorkoutExecution() {
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<number>(todayIndex);
  const [workouts, setWorkouts] = useState<Exercicio[]>([]);
  const [conclusions, setConclusions] = useState<Conclusao[]>([]);
  const [loading, setLoading] = useState(false);

  // Calcula a data exata em 'YYYY-MM-DD' baseada no dia da semana selecionado (na mesma semana)
  const offset = selectedDay - todayIndex;
  const targetDateString = getLocalDateString(offset);

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
      <div className="mb-8 flex flex-col items-center">
        <h2 className="font-headline text-headline-md text-on-surface tracking-widest uppercase">
          {['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'][selectedDay]}
        </h2>
        
        {/* Ruler Day Selector */}
        <div className="w-full mt-6 overflow-x-auto no-scrollbar relative py-4 border-t border-b border-surface-variant">
          <div className="flex justify-between min-w-[300px] md:min-w-full px-4">
            {DIAS_CURTO.map((day, i) => (
              <div 
                key={day} 
                onClick={() => setSelectedDay(i)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${selectedDay === i ? 'relative' : 'opacity-50 hover:opacity-100'}`}
              >
                <span className={`font-label text-label-sm ${selectedDay === i ? 'text-primary font-bold' : 'text-on-surface'}`}>{day}</span>
                <div className={`w-[2px] ${selectedDay === i ? 'h-4 bg-primary w-[3px]' : 'h-3 bg-on-surface'}`}></div>
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
              <div className="border-b-2 border-surface-variant pb-2 mb-6">
                <h3 className="font-headline text-headline-md uppercase font-bold tracking-tight">{blocoName}</h3>
              </div>
              
              <div className="space-y-6">
                {exercises.map((ex) => {
                  const isCompleted = conclusions.some(c => c.exercicioId === ex.id);

                  return (
                    <div 
                      key={ex.id}
                      onClick={() => handleToggle(ex.id)}
                      className={`relative p-4 border rounded-lg transition-colors cursor-pointer ${isCompleted ? 'border-primary bg-primary-container/10' : 'border-outline-variant bg-surface hover:border-primary'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-body text-body-md font-bold uppercase pr-8">{ex.nome}</h4>
                        
                        {!isCompleted ? (
                          <button className="h-[32px] px-4 border border-outline-variant rounded font-label text-label-sm hover:bg-surface-variant transition-colors uppercase whitespace-nowrap">
                            Marcar Feito
                          </button>
                        ) : null}

                        {/* Stamp Overlay */}
                        {isCompleted && (
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary text-on-primary stamp-effect flex items-center justify-center transform rotate-12 opacity-90 pointer-events-none rounded-full">
                            <span className="font-headline text-xl transform -rotate-12">FEITO</span>
                          </div>
                        )}
                      </div>

                      <div className={`grid grid-cols-4 gap-4 border-t border-surface-variant pt-4 transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="col-span-1 font-label text-label-sm text-on-surface-variant">SÉRIES</div>
                        <div className="col-span-1 font-label text-label-sm text-on-surface-variant">REPS</div>
                        <div className="col-span-2 font-label text-label-sm text-on-surface-variant">PESO (KG)</div>
                        
                        <div className="col-span-1 font-body text-body-lg">{ex.series}</div>
                        <div className="col-span-1 font-body text-body-lg">{ex.reps}</div>
                        <div className="col-span-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Minus size={16} /></button>
                          <input type="text" placeholder="-" className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-body text-body-lg focus:outline-none focus:border-primary" />
                          <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Plus size={16} /></button>
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
            <button className="h-[56px] px-8 bg-primary text-on-primary font-label text-label-sm rounded-lg hover:bg-opacity-90 transition-opacity active:scale-95 flex items-center gap-2">
              <CheckCircle size={20} />
              CONCLUIR TREINO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
