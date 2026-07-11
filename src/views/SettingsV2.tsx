import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, GrupoMuscular, ExercicioV2 } from '../lib/api';

export function SettingsV2() {
  const [grupos, setGrupos] = useState<GrupoMuscular[]>([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [exercicios, setExercicios] = useState<ExercicioV2[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [nome, setNome] = useState('');
  const [series, setSeries] = useState('4');
  const [reps, setReps] = useState('10-12');
  const [ativo, setAtivo] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchGrupos = async () => {
    try {
      const data = await api.getGrupos();
      setGrupos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExercicios = async (grupoId: string) => {
    setLoading(true);
    try {
      const data = await api.getExercicios(grupoId);
      setExercicios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (grupos.length > 0) {
      fetchExercicios(grupos[activeGroupIndex].id);
    }
  }, [grupos, activeGroupIndex]);

  const activeGroup = grupos[activeGroupIndex];

  const handleSave = async () => {
    if (!nome.trim()) {
      setError('O Nome do Exercício é obrigatório.');
      return;
    }
    
    setError('');
    setIsSaving(true);
    
    try {
      if (editingId) {
        await api.updateExercicio(editingId, {
          nome: nome.trim(),
          series: parseInt(series) || 1,
          repeticoes: reps,
        });
      } else {
        await api.createExercicio({
          grupoMuscularId: activeGroup.id,
          nome: nome.trim(),
          series: parseInt(series) || 1,
          repeticoes: reps,
          ativo,
        });
      }
      resetForm();
      fetchExercicios(activeGroup.id);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar. Verifique o console.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (ex: ExercicioV2) => {
    setNome(ex.nome);
    setSeries(ex.series.toString());
    setReps(ex.repeticoes);
    setAtivo(ex.ativo);
    setEditingId(ex.id);
    setIsFormOpen(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este exercício?')) return;
    try {
      await api.deleteExercicio(id);
      fetchExercicios(activeGroup.id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir exercício.');
    }
  };

  const handleToggleAtivo = async (id: string, currentAtivo: boolean) => {
    // Optimistic update
    setExercicios(exercicios.map(ex => ex.id === id ? { ...ex, ativo: !currentAtivo } : ex));
    try {
      await api.toggleExercicioAtivo(id, !currentAtivo);
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchExercicios(activeGroup.id);
    }
  };

  const resetForm = () => {
    setNome('');
    setSeries('4');
    setReps('10-12');
    setAtivo(true);
    setError('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handlePrevGroup = () => {
    if (activeGroupIndex > 0) {
      setActiveGroupIndex(activeGroupIndex - 1);
      resetForm();
    }
  };

  const handleNextGroup = () => {
    if (activeGroupIndex < grupos.length - 1) {
      setActiveGroupIndex(activeGroupIndex + 1);
      resetForm();
    }
  };

  if (grupos.length === 0) {
    return <div className="text-center py-8">Carregando grupos...</div>;
  }

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop pt-8 pb-12">
      <h2 className="font-headline text-headline-md text-on-surface uppercase tracking-widest mb-6">CONFIGURAÇÕES</h2>
      
      {/* Horizontal Carousel for Muscle Groups */}
      <div className="w-full mb-8 relative">
        <div className="flex items-center justify-between bg-surface-container border border-outline-variant rounded-xl p-4 mb-6">
          <button 
            onClick={handlePrevGroup}
            disabled={activeGroupIndex === 0}
            className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 text-center font-headline text-headline-sm uppercase tracking-widest text-primary">
            {activeGroup?.nome}
          </div>
          
          <button 
            onClick={handleNextGroup}
            disabled={activeGroupIndex === grupos.length - 1}
            className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Exercises List */}
        <div className="bg-surface-container text-on-surface border border-outline-variant rounded-xl overflow-hidden mb-6">
          <div className="flex justify-between items-center p-4 border-b border-surface-variant bg-surface">
            <h3 className="font-body text-body-md font-bold uppercase tracking-widest">EXERCÍCIOS</h3>
          </div>

          <div className="bg-surface-container-lowest min-h-[100px]">
            {loading ? (
              <div className="text-center py-8 text-on-surface-variant font-body">Carregando...</div>
            ) : exercicios.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant font-body opacity-50">
                Nenhum exercício cadastrado.
              </div>
            ) : (
              exercicios.map((ex) => (
                <div key={ex.id} className={`flex border-b border-surface-variant hover:bg-surface-container-low transition-colors items-stretch ${!ex.ativo ? 'opacity-50' : ''}`}>
                  
                  {/* Left: Info */}
                  <div className="flex-1 p-4 flex flex-col justify-center border-r border-surface-variant">
                    <span className="font-body text-body-lg font-bold">{ex.nome}</span>
                    <span className="font-label text-label-sm text-on-surface-variant mt-1">
                      {ex.series} SÉRIES • {ex.repeticoes} REPS
                    </span>
                  </div>

                  {/* Middle: Actions */}
                  <div className="w-16 flex flex-col border-r border-surface-variant items-center justify-center gap-2">
                    <button onClick={() => handleEdit(ex)} className="text-on-surface-variant hover:text-primary transition-colors p-2"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(ex.id)} className="text-on-surface-variant hover:text-error transition-colors p-2"><Trash2 size={18} /></button>
                  </div>

                  {/* Right: Toggle */}
                  <div className="w-20 flex items-center justify-center">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={ex.ativo}
                          onChange={() => handleToggleAtivo(ex.id, ex.ativo)}
                        />
                        <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="w-full p-4 font-label text-label-sm text-primary flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors uppercase font-bold"
          >
            <Plus size={16} /> ADICIONAR EXERCÍCIO
          </button>
        </div>

        {/* Configuration Form */}
        {isFormOpen && (
          <div className="border-l-4 border-primary pl-4 py-2 mt-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="font-label text-label-sm text-on-surface uppercase border-b border-surface-variant pb-2 mb-6">
                {editingId ? 'EDITAR EXERCÍCIO' : 'NOVO EXERCÍCIO'} - {activeGroup?.nome}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">
                    NOME DO EXERCÍCIO <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Supino Reto c/ Barra"
                    className={`w-full h-12 px-4 bg-surface-container-lowest border rounded-lg font-body text-body-md focus:outline-none focus:ring-1 transition-colors ${error.includes('Nome') ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-500/5' : 'border-outline-variant focus:border-primary focus:ring-primary'}`}
                  />
                </div>

                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">SÉRIES ALVO</label>
                  <div className="flex border border-outline-variant rounded-lg h-12 overflow-hidden bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <button 
                      onClick={() => setSeries(String(Math.max(1, parseInt(series) - 1)))}
                      className="w-12 h-full flex items-center justify-center border-r border-outline-variant hover:bg-surface-variant text-on-surface transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <input 
                      type="text" 
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      className="flex-1 h-full text-center font-display text-[24px] focus:outline-none"
                    />
                    <button 
                      onClick={() => setSeries(String(parseInt(series) + 1))}
                      className="w-12 h-full flex items-center justify-center border-l border-outline-variant hover:bg-surface-variant text-on-surface transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-label text-label-sm text-on-surface-variant uppercase mb-2">FAIXA DE REPETIÇÕES</label>
                  <input 
                    type="text" 
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="Ex: 10-12"
                    className="w-full h-12 px-4 text-center bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg font-label text-label-sm text-center">
                    {error}
                  </div>
                )}

                <div className="border-t border-surface-variant pt-6 mt-6 flex gap-4">
                  <button 
                    onClick={resetForm}
                    className="flex-1 h-12 border border-outline-variant rounded-lg font-label text-label-sm uppercase hover:bg-surface-variant transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-12 bg-primary text-on-primary rounded-lg font-label text-label-sm uppercase hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSaving ? 'SALVANDO...' : editingId ? 'ATUALIZAR' : 'SALVAR'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
