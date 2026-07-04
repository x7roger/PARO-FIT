import { Plus, Edit2, Trash2, Minus } from 'lucide-react';

export function WorkoutEditor() {
  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-12">
      <h2 className="font-headline text-headline-md text-on-surface uppercase tracking-widest mb-6">CONFIGURAÇÕES</h2>
      
      {/* Settings Tabs */}
      <div className="w-full mb-8">
        <div className="flex border-b border-surface-variant overflow-x-auto no-scrollbar mb-6">
          {['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'].map((day) => (
            <button
              key={day}
              className={`font-label text-label-sm uppercase px-4 py-3 whitespace-nowrap transition-colors ${
                day === 'SEGUNDA' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
          <h2 className="font-label text-label-sm text-on-surface-variant uppercase">BLOCOS ATIVOS - SEGUNDA</h2>
          <button className="font-label text-label-sm text-primary flex items-center gap-1 hover:opacity-80 uppercase">
            <Plus size={14} /> ADICIONAR BLOCO
          </button>
        </div>

        <div className="bg-surface-container text-on-surface border border-outline-variant rounded-xl overflow-hidden mb-6">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-surface-variant bg-surface">
            <h3 className="font-body text-body-md font-bold uppercase tracking-widest">PEITO</h3>
            <div className="flex gap-4 text-on-surface-variant">
              <button className="hover:text-primary"><Edit2 size={18} /></button>
              <button className="hover:text-error"><Trash2 size={18} /></button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-surface-container-lowest">
            {/* Exercise Item */}
            <div className="flex border-b border-surface-variant hover:bg-surface-container-low transition-colors">
              <div className="flex-1 p-4 flex items-center gap-3 border-r border-surface-variant">
                <div className="grid grid-cols-2 grid-rows-3 gap-0.5 opacity-30">
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                </div>
                <span className="font-body text-body-md">Supino Reto c/ Barra</span>
              </div>
              <div className="w-24 p-4 flex items-center justify-center font-body text-body-md text-on-surface-variant">
                4x 10-12
              </div>
            </div>

            {/* Exercise Item */}
            <div className="flex border-b border-surface-variant hover:bg-surface-container-low transition-colors">
              <div className="flex-1 p-4 flex items-center gap-3 border-r border-surface-variant">
                <div className="grid grid-cols-2 grid-rows-3 gap-0.5 opacity-30">
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                  <div className="w-1 h-1 bg-on-surface rounded-full"></div>
                </div>
                <span className="font-body text-body-md">Crucifixo Inclinado Halter</span>
              </div>
              <div className="w-24 p-4 flex items-center justify-center font-body text-body-md text-on-surface-variant">
                3x 12-15
              </div>
            </div>

            {/* Add Exercise Action */}
            <button className="w-full p-4 flex items-center justify-center gap-2 text-primary font-label text-label-sm uppercase hover:bg-surface-container-low transition-colors">
              <Plus size={16} /> ADICIONAR EXERCÍCIO
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="border-l-4 border-primary pl-4 py-2 mt-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-label text-label-sm text-on-surface uppercase border-b border-surface-variant pb-2 mb-6">
              CONFIGURAR EXERCÍCIO
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">NOME DO EXERCÍCIO</label>
                <input 
                  type="text" 
                  defaultValue="Voador Máquina" 
                  className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">SÉRIES ALVO</label>
                <div className="flex border border-outline-variant rounded-lg h-12 overflow-hidden bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <button className="w-12 h-full flex items-center justify-center border-r border-outline-variant hover:bg-surface-variant text-on-surface transition-colors">
                    <Minus size={20} />
                  </button>
                  <input 
                    type="text" 
                    defaultValue="4" 
                    className="flex-1 h-full text-center font-display text-[24px] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">FAIXA DE REPETIÇÕES</label>
                <input 
                  type="text" 
                  defaultValue="10-12" 
                  className="w-full h-12 px-4 text-center bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="border-t border-surface-variant pt-6 mt-6 flex gap-4">
                <button className="flex-1 h-12 border border-outline-variant rounded-lg font-label text-label-sm uppercase hover:bg-surface-variant transition-colors">
                  CANCELAR
                </button>
                <button className="flex-1 h-12 bg-primary text-on-primary rounded-lg font-label text-label-sm uppercase hover:opacity-90 active:scale-95 transition-all">
                  SALVAR NO PEITO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
