
import React, { useState, useMemo, useCallback } from 'react';
import { INVENTORY } from './constants';
import { Billboard, FilterState, INITIAL_FILTERS } from './types';
import FilterSidebar from './components/FilterSidebar';
import { FilterIcon, MapIcon, SparklesIcon } from './components/Icons';
import { analyzeInventory } from './services/geminiService';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Logic to filter data
  const filteredData = useMemo(() => {
    return INVENTORY.filter((item: Billboard) => {
      // Case insensitive partial matches
      const matchCode = item.codigo.toLowerCase().includes(filters.codigo.toLowerCase());
      const matchElement = filters.elemento ? item.elemento === filters.elemento : true;
      const matchDistrict = filters.distrito ? item.distrito === filters.distrito : true;
      const matchType = filters.tipo ? item.tipo === filters.tipo : true;
      const matchDept = filters.departamento ? item.departamento === filters.departamento : true;
      const matchFormat = item.formato.toLowerCase().includes(filters.formato.toLowerCase());
      
      const matchAncho = filters.ancho ? item.ancho.includes(filters.ancho) : true;
      const matchAlto = filters.alto ? item.alto.includes(filters.alto) : true;

      return matchCode && matchElement && matchDistrict && matchType && matchDept && matchFormat && matchAncho && matchAlto;
    });
  }, [filters]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setAiAnalysis(null); // Reset analysis when filters change
  };

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const result = await analyzeInventory(filteredData);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  }, [filteredData]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">O</div>
               <span className="text-xl font-bold tracking-tight text-slate-900">JMT outdoors</span>
            </div>
            <div className="flex space-x-4 items-center">
               <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                 Total: <span className="text-slate-900 font-semibold">{INVENTORY.length}</span>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario de Vallas</h1>
            <p className="text-slate-500 mt-1 text-lg">
              {filteredData.length} ubicaciones encontradas
              {activeFilterCount > 0 && <span className="text-indigo-600 font-medium"> (Filtros activos)</span>}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || filteredData.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Analizando...</span>
                </div>
              ) : (
                <>
                  <SparklesIcon />
                  <span>Analizar con IA</span>
                </>
              )}
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <FilterIcon />
              <span>Filtrar</span>
              {activeFilterCount > 0 && (
                <span className="bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1 font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mb-8 bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm ring-1 ring-indigo-50">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-indigo-50">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <SparklesIcon />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Insights de Inteligencia Artificial</h3>
            </div>
            <div className="prose prose-indigo prose-sm max-w-none text-slate-600 leading-relaxed">
              {aiAnalysis.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap w-16 text-center">Mapa</th>
                  <th className="px-6 py-4 whitespace-nowrap">Código</th>
                  <th className="px-6 py-4 whitespace-nowrap">Elemento / Formato</th>
                  <th className="px-6 py-4 whitespace-nowrap">Ubicación</th>
                  <th className="px-6 py-4 whitespace-nowrap">Tipo</th>
                  <th className="px-6 py-4 whitespace-nowrap">Medida</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Audiencia</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Zona</th>
                  <th className="px-6 py-4 whitespace-nowrap">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        {item.latitud && item.longitud && (item.latitud !== 0 || item.longitud !== 0) ? (
                            <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${item.latitud},${item.longitud}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                            title="Ver ubicación en Google Maps"
                            >
                            <MapIcon />
                            </a>
                        ) : (
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-gray-300 cursor-not-allowed">
                                <MapIcon />
                            </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.codigo}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.elemento}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">Cara {item.cara}</span>
                          <span>{item.formato}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-medium text-slate-800 truncate" title={item.direccionComercial}>{item.direccionComercial}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.distrito}, {item.departamento}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.tipo.toUpperCase().includes('DIGITAL') 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{item.medida}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                        {item.audiencia > 0 ? item.audiencia.toLocaleString() : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="inline-block bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-semibold border border-gray-200">
                           {item.zona || 'GENERAL'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={item.observacion}>
                        {item.observacion || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">No se encontraron resultados</p>
                        <p className="text-sm text-gray-500 mt-1">No hay vallas que coincidan con los filtros seleccionados. Intenta limpiar los filtros o buscar otro código.</p>
                        <button 
                          onClick={() => setFilters(INITIAL_FILTERS)}
                          className="mt-6 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div>
              Mostrando {filteredData.length} de {INVENTORY.length} registros
            </div>
            <div>
              Datos actualizados recientemente
            </div>
          </div>
        </div>
      </main>

      {/* Filters Sidebar Component */}
      <FilterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

    </div>
  );
};

export default App;
