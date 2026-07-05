import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function Evolution() {
  const [stats, setStats] = useState<{
    streak: number;
    heatmapData: Record<string, number>;
    weekData: number[];
  } | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  // Calcular conclusão mensal (últimos 30 dias ativos)
  const calculateMonthly = () => {
    if (!stats) return 0;
    const { heatmapData } = stats;
    let daysActive = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      if (heatmapData[dStr] && heatmapData[dStr] > 0) daysActive++;
    }
    // Simplificação: porcentagem de dias ativos nos últimos 30 dias. 
    // Como a pessoa não treina todo dia, 20 dias seria 100%. (Limitando a 100%)
    const score = Math.round((daysActive / 20) * 100);
    return score > 100 ? 100 : score;
  };

  // Gerar grid de 90 dias para o Heatmap (13 semanas x 7 dias = 91 dias)
  const generateHeatmapGrid = () => {
    const grid = [];
    if (!stats) return grid;
    const { heatmapData } = stats;
    
    // Matriz de 7 linhas (Dom a Sáb) por 13 colunas
    for (let row = 0; row < 7; row++) {
      const rowData = [];
      for (let col = 12; col >= 0; col--) {
        const offset = (col * 7) + (6 - row); // retrocedendo dias
        const d = new Date();
        d.setDate(d.getDate() - offset);
        const dStr = d.toISOString().split('T')[0];
        
        const count = heatmapData[dStr] || 0;
        let bgColor = 'bg-surface-variant';
        if (count > 8) bgColor = 'bg-primary-container opacity-100';
        else if (count > 5) bgColor = 'bg-primary-container opacity-80';
        else if (count > 2) bgColor = 'bg-primary-container opacity-60';
        else if (count > 0) bgColor = 'bg-primary-container opacity-40';
        
        rowData.push(
          <div 
            key={`${row}-${col}`} 
            className={`w-4 h-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-125 hover:shadow-[0_0_12px_rgba(0,0,0,0.1)] ${bgColor}`} 
            title={`${dStr}: ${count} exercícios`} 
          />
        );
      }
      grid.push(<div key={`row-${row}`} className="flex gap-1.5">{rowData}</div>);
    }
    return grid;
  };

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-12 pb-32 flex flex-col gap-24 animate-in fade-in duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]">
      {/* High-End Metrics (Double-Bezel Architecture) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Card 1 */}
        <div className="p-2 bg-surface-container-lowest/50 ring-1 ring-outline-variant/30 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-3xl transform hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <div className="bg-surface-container-lowest rounded-[calc(2rem-0.5rem)] p-8 h-full flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium mb-4">SEQUÊNCIA ATUAL</span>
            </div>
            <div className="font-display text-display-lg tracking-tight text-on-surface z-10">
              {stats ? stats.streak : '-'}
              <span className="font-body text-body-md tracking-normal text-on-surface-variant uppercase ml-2">Dias</span>
            </div>
            {/* Subtle Ethereal Orb */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-2 bg-surface-container-lowest/50 ring-1 ring-outline-variant/30 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-3xl transform hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <div className="bg-surface-container-lowest rounded-[calc(2rem-0.5rem)] p-8 h-full flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center">
              <span className="rounded-full bg-on-surface/5 text-on-surface-variant px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium mb-4">CONCL. MENSAL</span>
            </div>
            <div className="font-display text-display-lg tracking-tight text-primary z-10">
              {stats ? calculateMonthly() : '-'}
              <span className="font-body text-body-md tracking-normal text-on-surface-variant ml-2">%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Heatmap (High-End) */}
      <section className="w-full">
        <div className="flex justify-between items-end mb-8 px-2">
          <div className="flex flex-col gap-2">
            <span className="rounded-full bg-on-surface/5 text-on-surface-variant w-max px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium">Histórico</span>
            <h2 className="font-headline text-[24px] uppercase tracking-wide">Registro de Consistência</h2>
          </div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hidden md:block">Últimos 90 dias</span>
        </div>
        
        <div className="p-2 bg-surface-container-lowest/50 ring-1 ring-outline-variant/30 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
          <div className="bg-surface-container-lowest rounded-[calc(2rem-0.5rem)] p-8 overflow-x-auto no-scrollbar shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="min-w-[340px] flex flex-col items-center">
              <div className="flex flex-col gap-2.5">
                {generateHeatmapGrid()}
              </div>

              <div className="flex w-full justify-end gap-3 mt-8 items-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                <span>Menos</span>
                <div className="w-4 h-4 rounded-full bg-surface-variant"></div>
                <div className="w-4 h-4 rounded-full bg-primary-container opacity-40"></div>
                <div className="w-4 h-4 rounded-full bg-primary-container opacity-70"></div>
                <div className="w-4 h-4 rounded-full bg-primary-container"></div>
                <span>Mais</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Frequency Graph (High-End) */}
      <section className="w-full">
        <div className="flex flex-col gap-2 mb-8 px-2">
          <span className="rounded-full bg-on-surface/5 text-on-surface-variant w-max px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium">Intensidade</span>
          <h2 className="font-headline text-[24px] uppercase tracking-wide">Pulso da Semana</h2>
        </div>
        
        <div className="p-2 bg-surface-container-lowest/50 ring-1 ring-outline-variant/30 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
          <div className="bg-surface-container-lowest rounded-[calc(2rem-0.5rem)] px-6 pt-12 pb-6 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-end justify-between h-64">
            
            {/* Elegant Hairlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-12 px-6">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-on-surface/5 to-transparent"></div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-on-surface/5 to-transparent"></div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-on-surface/5 to-transparent"></div>
            </div>
            
            {/* Floating Pill Bars */}
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((label, idx) => {
              const count = stats?.weekData[idx] || 0;
              // Max height scaled for container
              const height = Math.min((count / 15) * 140, 140);
              const isToday = new Date().getDay() === idx;

              return (
                <div key={idx} className="flex flex-col items-center z-10 w-10 relative h-full justify-end group">
                  <div className="relative w-4 flex flex-col justify-end items-center mb-6 h-[140px]">
                    {count > 0 && (
                       <div 
                        className={`w-full rounded-full absolute bottom-0 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${isToday ? 'bg-primary shadow-[0_0_12px_rgba(0,0,0,0.2)]' : 'bg-on-surface/20 group-hover:bg-on-surface/40'}`} 
                        style={{ height: `${height}px` }}
                       ></div>
                    )}
                  </div>
                  <span className={`font-label text-[10px] uppercase tracking-widest transition-colors ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
