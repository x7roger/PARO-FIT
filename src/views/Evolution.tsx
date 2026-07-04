export function Evolution() {
  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 flex flex-col gap-xl">
      {/* Key Metrics */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest text-on-surface p-5 flex flex-col justify-between border border-outline-variant/30 rounded-xl shadow-sm h-32 relative overflow-hidden group">
          <div className="font-label text-label-sm text-on-surface-variant">SEQUÊNCIA ATUAL</div>
          <div className="font-display text-display-lg-mobile tracking-tight z-10">
            12 <span className="font-body text-body-md text-on-surface-variant uppercase">Dias</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-container/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest text-on-surface p-5 flex flex-col justify-between border border-outline-variant/30 rounded-xl shadow-sm h-32">
          <div className="font-label text-label-sm text-on-surface-variant">CONCL. MENSAL</div>
          <div className="font-display text-display-lg-mobile text-primary tracking-tight">
            85<span className="font-body text-body-lg">%</span>
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
          <div className="min-w-[500px]">
            <div className="flex gap-1 mb-2 font-label text-[10px] text-on-surface-variant">
              <div className="flex-1">JAN</div>
              <div className="flex-1">FEV</div>
              <div className="flex-1">MAR</div>
            </div>
            
            {/* Heatmap Grid (Simulated) */}
            <div className="flex flex-col gap-1.5">
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5">
                  {[...Array(17)].map((_, colIndex) => {
                    const intensity = Math.random();
                    let bgColor = 'bg-surface-variant';
                    if (intensity > 0.8) bgColor = 'bg-primary-container opacity-100';
                    else if (intensity > 0.6) bgColor = 'bg-primary-container opacity-80';
                    else if (intensity > 0.4) bgColor = 'bg-primary-container opacity-60';
                    else if (intensity > 0.2) bgColor = 'bg-primary-container opacity-40';
                    
                    return (
                      <div 
                        key={colIndex} 
                        className={`w-3.5 h-3.5 rounded-sm ${bgColor}`} 
                      />
                    );
                  })}
                </div>
              ))}
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
        <h2 className="font-headline text-[18px] uppercase border-b border-outline-variant/50 pb-2">Pulso de Intensidade</h2>
        <div className="relative h-48 w-full flex items-end justify-between px-4 pt-6 border-l border-b border-outline-variant/50 bg-surface-container-lowest rounded-tr-xl rounded-br-xl mt-2 overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8 pt-6">
            <div className="w-full h-px bg-on-surface"></div>
            <div className="w-full h-px bg-on-surface"></div>
            <div className="w-full h-px bg-on-surface"></div>
          </div>
          
          {/* SVG Line Chart Overlay */}
          <svg className="absolute inset-0 w-full h-full pb-8" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="opacity-80" d="M 0 80 Q 15 70, 20 40 T 40 50 T 60 20 T 80 60 T 100 30" fill="none" stroke="#f27438" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            <path className="opacity-10" d="M 0 80 Q 15 70, 20 40 T 40 50 T 60 20 T 80 60 T 100 30 L 100 100 L 0 100 Z" fill="#f27438"></path>
          </svg>

          {/* Data Points / Labels */}
          {[
            { label: 'SEG', height: 'mb-3', border: 'border-primary-container', bg: 'bg-surface-container-lowest' },
            { label: 'TER', height: 'mb-14', border: 'border-primary-container', bg: 'bg-surface-container-lowest' },
            { label: 'QUA', height: 'mb-9', border: 'border-surface-container-lowest shadow-sm', bg: 'bg-primary-container' },
            { label: 'QUI', height: 'mb-[72px]', border: 'border-primary-container', bg: 'bg-surface-container-lowest' },
            { label: 'SEX', height: 'mb-7', border: 'border-primary-container', bg: 'bg-surface-container-lowest' },
            { label: 'SÁB', height: 'mb-16', border: 'border-surface-container-lowest shadow-md', bg: 'bg-primary-container', labelColor: 'text-primary font-bold' },
            { label: 'DOM', height: '', border: '', bg: '', noDot: true }
          ].map((point, idx) => (
            <div key={idx} className="flex flex-col items-center z-10 w-8">
              {!point.noDot && <div className={`w-2.5 h-2.5 rounded-full ${point.height} border-[1.5px] ${point.border} ${point.bg}`}></div>}
              {point.noDot && <span className="mb-2 mt-4 inline-block"></span>}
              <span className={`font-label text-[10px] ${point.labelColor || 'text-on-surface-variant'} mb-2`}>{point.label}</span>
            </div>
          ))}

          {/* Y-Axis Labels */}
          <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-6 pb-12 font-label text-[10px] text-on-surface-variant">
            <span>AL</span>
            <span>MD</span>
            <span>BX</span>
          </div>
        </div>
      </section>
    </div>
  );
}
