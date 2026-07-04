/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Calendar, Settings, Dumbbell, TrendingUp, LayoutGrid } from 'lucide-react';
import { WorkoutExecution } from './views/WorkoutExecution';
import { WorkoutEditor } from './views/WorkoutEditor';
import { Evolution } from './views/Evolution';

type Tab = 'treino' | 'evolucao' | 'configuracao';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('treino');

  const renderView = () => {
    switch (activeTab) {
      case 'treino':
        return <WorkoutExecution />;
      case 'evolucao':
        return <Evolution />;
      case 'configuracao':
        return <WorkoutEditor />;
      default:
        return <WorkoutExecution />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'treino':
        return 'PARO FIT';
      case 'evolucao':
        return 'EVOLUÇÃO';
      case 'configuracao':
        return 'CONFIGURAÇÃO';
      default:
        return 'PARO FIT';
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0">
      {/* Top App Bar - Mobile */}
      <header className="md:hidden sticky top-0 w-full z-40 bg-background border-b border-surface-variant flex justify-between items-center px-margin-mobile py-4">
        <button className="text-on-surface-variant hover:opacity-80 active:scale-95 transition-all">
          <Calendar size={24} />
        </button>
        <h1 className="text-display-lg-mobile font-display uppercase tracking-tight text-primary">
          {getTitle()}
        </h1>
        <button className="text-on-surface-variant hover:opacity-80 active:scale-95 transition-all">
          <Settings size={24} />
        </button>
      </header>

      {/* Top App Bar - Desktop */}
      <header className="hidden md:flex sticky top-0 w-full z-40 bg-background border-b border-surface-variant justify-between items-center px-margin-desktop py-4">
        <h1 className="text-display-lg font-display uppercase tracking-tight text-primary">
          {getTitle()}
        </h1>
        <nav className="flex gap-8">
          <button 
            onClick={() => setActiveTab('treino')}
            className={`font-label text-label-sm uppercase transition-colors ${activeTab === 'treino' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            TREINO
          </button>
          <button 
            onClick={() => setActiveTab('evolucao')}
            className={`font-label text-label-sm uppercase transition-colors ${activeTab === 'evolucao' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            EVOLUÇÃO
          </button>
          <button 
            onClick={() => setActiveTab('configuracao')}
            className={`font-label text-label-sm uppercase transition-colors ${activeTab === 'configuracao' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}
          >
            CONFIGURAÇÃO
          </button>
        </nav>
        <button className="text-on-surface-variant hover:opacity-80 active:scale-95 transition-all">
          <Settings size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-start">
        {renderView()}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter py-2 bg-background border-t border-surface-variant shadow-sm">
        <button 
          onClick={() => setActiveTab('treino')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-all active:scale-90 ${activeTab === 'treino' ? 'text-primary bg-primary-container/20 rounded-full px-5 py-1.5' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <Dumbbell size={24} strokeWidth={activeTab === 'treino' ? 2.5 : 2} className="mb-1" />
          <span className="font-label text-label-sm text-[10px]">TREINO</span>
        </button>
        <button 
          onClick={() => setActiveTab('evolucao')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-all active:scale-90 ${activeTab === 'evolucao' ? 'text-primary bg-primary-container/20 rounded-full px-5 py-1.5' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <TrendingUp size={24} strokeWidth={activeTab === 'evolucao' ? 2.5 : 2} className="mb-1" />
          <span className="font-label text-label-sm text-[10px]">EVOLUÇÃO</span>
        </button>
        <button 
          onClick={() => setActiveTab('configuracao')}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] transition-all active:scale-90 ${activeTab === 'configuracao' ? 'text-primary bg-primary-container/20 rounded-full px-5 py-1.5' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <Settings size={24} strokeWidth={activeTab === 'configuracao' ? 2.5 : 2} className="mb-1" />
          <span className="font-label text-label-sm text-[10px]">CONFIGURAÇÃO</span>
        </button>
      </nav>
    </div>
  );
}
