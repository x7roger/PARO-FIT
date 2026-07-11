/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Calendar, Settings, Dumbbell, TrendingUp, LayoutGrid } from 'lucide-react';
import { WorkoutExecution } from './views/WorkoutExecution';
import { WorkoutEditor } from './views/WorkoutEditor';
import { SettingsV2 } from './views/SettingsV2';
import { Evolution } from './views/Evolution';

type Tab = 'treino' | 'evolucao' | 'configuracao';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('treino');
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<number>(todayIndex);

  const renderView = () => {
    switch (activeTab) {
      case 'treino':
        return <WorkoutExecution selectedDay={selectedDay} setSelectedDay={setSelectedDay} />;
      case 'evolucao':
        return <Evolution />;
      case 'configuracao':
        return <SettingsV2 />;
      default:
        return <WorkoutExecution selectedDay={selectedDay} setSelectedDay={setSelectedDay} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'treino':
        return ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'][selectedDay];
      case 'evolucao':
        return 'EVOLUÇÃO';
      case 'configuracao':
        return 'CONFIGURAÇÃO';
      default:
        return 'PARO FIT';
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] pb-[64px] md:pb-0 bg-background">
      {/* Top App Bar - Mobile */}
      <header className="md:hidden sticky top-0 w-full z-40 bg-background/90 backdrop-blur-md border-b border-surface-variant flex justify-between items-center px-margin-mobile h-[52px]">
        <div className="text-on-surface-variant font-display font-bold text-xs uppercase tracking-widest p-2 -ml-2">
          PARO FIT
        </div>
        <h1 className="text-base font-display font-bold uppercase tracking-tight text-primary">
          {getTitle()}
        </h1>
        <button onClick={() => setActiveTab('configuracao')} className={`hover:text-primary active:scale-95 transition-all p-2 -mr-2 ${activeTab === 'configuracao' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <Settings size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Top App Bar - Desktop */}
      <header className="hidden md:flex sticky top-0 w-full z-40 bg-background/90 backdrop-blur-md border-b border-surface-variant justify-between items-center px-margin-desktop h-[60px]">
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant font-display font-bold text-sm uppercase tracking-widest">
            PARO FIT
          </span>
          <div className="w-1 h-1 bg-surface-variant rounded-full"></div>
          <h1 className="text-lg font-display font-bold uppercase tracking-tight text-primary">
            {getTitle()}
          </h1>
        </div>
        <nav className="flex gap-8 h-full items-center">
          <button 
            onClick={() => setActiveTab('treino')}
            className={`font-label text-[11px] font-bold tracking-widest uppercase transition-colors relative h-full flex items-center ${activeTab === 'treino' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            TREINO
            {activeTab === 'treino' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('evolucao')}
            className={`font-label text-[11px] font-bold tracking-widest uppercase transition-colors relative h-full flex items-center ${activeTab === 'evolucao' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            EVOLUÇÃO
            {activeTab === 'evolucao' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></div>}
          </button>
        </nav>
        <button onClick={() => setActiveTab('configuracao')} className={`hover:text-primary active:scale-95 transition-all p-2 -mr-2 ${activeTab === 'configuracao' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <Settings size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-start">
        {renderView()}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center gap-20 items-center px-gutter h-[64px] bg-background/90 backdrop-blur-2xl border-t border-surface-variant shadow-[0_-8px_32px_rgba(0,0,0,0.04)]">
        <button 
          onClick={() => setActiveTab('treino')}
          className="group flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95"
        >
          <div className={`relative flex items-center justify-center w-8 h-8 transition-colors duration-300 ${activeTab === 'treino' ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
            <Dumbbell size={22} strokeWidth={activeTab === 'treino' ? 2.5 : 2} />
          </div>
          <span className={`font-label text-[9px] tracking-widest font-bold uppercase transition-colors duration-300 mt-0.5 ${activeTab === 'treino' ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>TREINO</span>
        </button>
        <button 
          onClick={() => setActiveTab('evolucao')}
          className="group flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95"
        >
          <div className={`relative flex items-center justify-center w-8 h-8 transition-colors duration-300 ${activeTab === 'evolucao' ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
            <TrendingUp size={22} strokeWidth={activeTab === 'evolucao' ? 2.5 : 2} />
          </div>
          <span className={`font-label text-[9px] tracking-widest font-bold uppercase transition-colors duration-300 mt-0.5 ${activeTab === 'evolucao' ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>EVOLUÇÃO</span>
        </button>
      </nav>
    </div>
  );
}
