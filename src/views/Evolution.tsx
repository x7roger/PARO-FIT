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
        
        rowData.push(<div key={`${row}-${col}`} className={`w-3.5 h-3.5 rounded-sm ${bgColor}`} title={`${dStr}: ${count} exercícios`} />);
      }
      grid.push(<div key={`row-${row}`} className="flex gap-1.5">{rowData}</div>);
    }
    return grid;
  };

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-24 flex flex-col gap-xl animate-in fade-in">
      {/* Key Metrics */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest text-on-surface p-5 flex flex-col justify-between border border-outline-variant/30 rounded-xl shadow-sm h-32 relative overflow-hidden group">
          <div className="font-label text-label-sm text-on-surface-variant">SEQUÊNCIA ATUAL</div>
          <div className="font-display text-display-lg-mobile tracking-tight z-10">
            {stats ? stats.streak : '-'} <span className="font-body text-body-md text-on-surface-variant uppercase">Dias</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-container/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest text-on-surface p-5 flex flex-col justify-between border border-outline-variant/30 rounded-xl shadow-sm h-32">
          <div className="font-label text-label-sm text-on-surface-variant">CONCL. MENSAL</div>
          <div className="font-display text-display-lg-mobile text-primary tracking-tight">
            {stats ? calculateMonthly() : '-'} <span className="font-body text-body-lg">%</span>
          </div>
        </div>
      </section>

      {/* Contribution Heatmap */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end border-b border-outline-variant/50 pb-2">
          <h2 className="font-headline text-[18px] uppercase">Registro de Consistência</h2>
          <span className="font-label text-label-sm text-on-surface-variant">ÚLTIMOS 90 DIAS</span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-outline-variant/30 overflow-x-auto no-scrollbar">
          <div className="min-w-[300px]">
            <div className="flex flex-col gap-1.5">
              {generateHeatmapGrid()}
            </div>

            <div className="flex justify-end gap-2 mt-4 items-center font-label text-[10px] text-on-surface-variant">
              <span>MENOS</span>
              <div className="w-3 h-3 rounded-sm bg-surface-variant"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-container opacity-40"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-container opacity-70"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-container"></div>
              <span>MAIS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Frequency Graph */}
      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-[18px] uppercase border-b border-outline-variant/50 pb-2">Pulso de Intensidade da Semana</h2>
        <div className="relative h-48 w-full flex items-end justify-between px-4 pt-6 border-l border-b border-outline-variant/50 bg-surface-container-lowest rounded-tr-xl rounded-br-xl mt-2 overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8 pt-6">
            <div className="w-full h-px bg-on-surface"></div>
            <div className="w-full h-px bg-on-surface"></div>
            <div className="w-full h-px bg-on-surface"></div>
          </div>
          
          {/* Data Points (Bars) / Labels */}
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((label, idx) => {
            const count = stats?.weekData[idx] || 0;
            // altura máxima = 15 exercícios = 100% da barra (~120px)
            const height = Math.min((count / 15) * 120, 120);
            const isToday = new Date().getDay() === idx;

            return (
              <div key={idx} className="flex flex-col items-center z-10 w-8 relative h-full justify-end">
                {count > 0 && (
                   <div 
                    className={`w-3 rounded-t-sm absolute bottom-8 transition-all duration-700 ease-out ${isToday ? 'bg-primary' : 'bg-primary-container opacity-70'}`} 
                    style={{ height: `${height}px` }}
                   ></div>
                )}
                <span className={`font-label text-[10px] ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant'} mb-2`}>{label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
