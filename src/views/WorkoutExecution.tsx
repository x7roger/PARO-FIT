import { Plus, Minus, CheckCircle } from 'lucide-react';

export function WorkoutExecution() {
  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-12">
      {/* Current Day Header */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="font-headline text-headline-md text-on-surface tracking-widest uppercase">SEGUNDA</h2>
        
        {/* Ruler Day Selector */}
        <div className="w-full mt-6 overflow-x-auto no-scrollbar relative py-4 border-t border-b border-surface-variant">
          <div className="flex justify-between min-w-[300px] md:min-w-full px-4">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((day, i) => (
              <div key={day} className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${day === 'SEG' ? 'relative' : 'opacity-50 hover:opacity-100'}`}>
                <span className={`font-label text-label-sm ${day === 'SEG' ? 'text-primary font-bold' : 'text-on-surface'}`}>{day}</span>
                <div className={`w-[2px] ${day === 'SEG' ? 'h-4 bg-primary w-[3px]' : 'h-3 bg-on-surface'}`}></div>
                {day === 'SEG' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-lg">
        {/* Block 1: PEITO */}
        <div className="bg-surface-container text-on-surface rounded-xl p-6 relative group overflow-hidden">
          <div className="border-b-2 border-surface-variant pb-2 mb-6">
            <h3 className="font-headline text-headline-md uppercase font-bold tracking-tight">PEITO</h3>
          </div>
          
          <div className="space-y-6">
            {/* Exercise 1 - Completed */}
            <div className="relative p-4 border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-body text-body-md font-bold uppercase">SUPINO RETO</h4>
                {/* Stamp Overlay */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-outline text-surface stamp-effect flex items-center justify-center transform rotate-12 opacity-90 pointer-events-none"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-surface-variant pt-4">
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">SÉRIES</div>
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">REPS</div>
                <div className="col-span-2 font-label text-label-sm text-on-surface-variant">PESO (KG)</div>
                
                <div className="col-span-1 font-body text-body-lg">4</div>
                <div className="col-span-1 font-body text-body-lg">8-10</div>
                <div className="col-span-2 flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Minus size={16} /></button>
                  <input type="text" readOnly value="60" className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-body text-body-lg focus:outline-none focus:border-primary" />
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            {/* Exercise 2 - In Progress */}
            <div className="relative p-4 border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-body text-body-md font-bold uppercase">SUPINO INCLINADO</h4>
                <button className="h-[32px] px-4 border border-outline-variant rounded font-label text-label-sm hover:bg-surface-variant transition-colors uppercase">
                  Marcar Feito
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-surface-variant pt-4">
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">SÉRIES</div>
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">REPS</div>
                <div className="col-span-2 font-label text-label-sm text-on-surface-variant">PESO (KG)</div>
                
                <div className="col-span-1 font-body text-body-lg">3</div>
                <div className="col-span-1 font-body text-body-lg">12</div>
                <div className="col-span-2 flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Minus size={16} /></button>
                  <input type="text" defaultValue="45" className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-body text-body-lg focus:outline-none focus:border-primary" />
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: TRÍCEPS */}
        <div className="bg-surface-container text-on-surface rounded-xl p-6 relative group overflow-hidden">
          <div className="border-b-2 border-surface-variant pb-2 mb-6">
            <h3 className="font-headline text-headline-md uppercase font-bold tracking-tight">TRÍCEPS</h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative p-4 border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-body text-body-md font-bold uppercase">PULLEY CORDA</h4>
                <button className="h-[32px] px-4 border border-outline-variant rounded font-label text-label-sm hover:bg-surface-variant transition-colors uppercase">
                  Marcar Feito
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-surface-variant pt-4">
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">SÉRIES</div>
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">REPS</div>
                <div className="col-span-2 font-label text-label-sm text-on-surface-variant">PESO (KG)</div>
                
                <div className="col-span-1 font-body text-body-lg">4</div>
                <div className="col-span-1 font-body text-body-lg">10</div>
                <div className="col-span-2 flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Minus size={16} /></button>
                  <input type="text" defaultValue="20" className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-body text-body-lg focus:outline-none focus:border-primary" />
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <div className="relative p-4 border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-body text-body-md font-bold uppercase">TRÍCEPS TESTA</h4>
                <button className="h-[32px] px-4 border border-outline-variant rounded font-label text-label-sm hover:bg-surface-variant transition-colors uppercase">
                  Marcar Feito
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-surface-variant pt-4">
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">SÉRIES</div>
                <div className="col-span-1 font-label text-label-sm text-on-surface-variant">REPS</div>
                <div className="col-span-2 font-label text-label-sm text-on-surface-variant">PESO (KG)</div>
                
                <div className="col-span-1 font-body text-body-lg">3</div>
                <div className="col-span-1 font-body text-body-lg">12</div>
                <div className="col-span-2 flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Minus size={16} /></button>
                  <input type="text" defaultValue="25" className="w-16 h-8 text-center bg-transparent border-b border-outline-variant font-body text-body-lg focus:outline-none focus:border-primary" />
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded font-body hover:bg-surface-variant transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Finish Workout Button */}
        <div className="pt-8 pb-12 flex justify-center">
          <button className="h-[56px] px-8 bg-primary text-on-primary font-label text-label-sm rounded-lg hover:bg-opacity-90 transition-opacity active:scale-95 flex items-center gap-2">
            <CheckCircle size={20} />
            CONCLUIR TREINO
          </button>
        </div>
      </div>
    </div>
  );
}
