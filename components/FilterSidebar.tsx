
import React, { useState } from 'react';
import { FilterState, INITIAL_FILTERS } from '../types';
import { DEPARTMENT_OPTIONS, DISTRICT_OPTIONS, ELEMENT_OPTIONS, TYPE_OPTIONS, ZONE_OPTIONS } from '../constants';
import { XMarkIcon } from './Icons';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  const handleChange = (key: keyof FilterState, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setLocalFilters(INITIAL_FILTERS);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-800">Filtros</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <XMarkIcon />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input
                type="text"
                value={localFilters.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Ej. LIM-001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Selects Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  value={localFilters.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Todos</option>
                  {DEPARTMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                <select
                  value={localFilters.distrito}
                  onChange={(e) => handleChange('distrito', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Todos</option>
                  {DISTRICT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elemento</label>
                <select
                  value={localFilters.elemento}
                  onChange={(e) => handleChange('elemento', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Todos</option>
                  {ELEMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="flex space-x-2">
                  {TYPE_OPTIONS.map(type => (
                    <button
                      key={type}
                      onClick={() => handleChange('tipo', localFilters.tipo === type ? '' : type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        localFilters.tipo === type
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ancho</label>
                  <input
                    type="text"
                    value={localFilters.ancho}
                    onChange={(e) => handleChange('ancho', e.target.value)}
                    placeholder="Ej. 8"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alto</label>
                  <input
                    type="text"
                    value={localFilters.alto}
                    onChange={(e) => handleChange('alto', e.target.value)}
                    placeholder="Ej. 4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                <input
                  type="text"
                  value={localFilters.formato}
                  onChange={(e) => handleChange('formato', e.target.value)}
                  placeholder="Ej. Horizontal"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
