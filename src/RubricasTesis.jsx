import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const RubricasTesis = ({ evaluador }) => {
  const [evaluaciones, setEvaluaciones] = useState({
    revision1: {
      criterio1: { valor: '', observaciones: '' },
      criterio2: { valor: '', observaciones: '' },
      criterio3: { valor: '', observaciones: '' },
      criterio4: { valor: '', observaciones: '' }
    },
    revision2: {
      criterio1: { valor: '', observaciones: '' },
      criterio2: { valor: '', observaciones: '' },
      criterio3: { valor: '', observaciones: '' },
      criterio4: { valor: '', observaciones: '' }
    }
  });

  const [activeRevision, setActiveRevision] = useState('revision1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const criterios = {
    criterio1: "Claridad y coherencia en la presentación",
    criterio2: "Dominio del tema y respuesta a preguntas",
    criterio3: "Calidad del material presentado",
    criterio4: "Cumplimiento de objetivos propuestos"
  };

  const handleEvaluacionChange = (revision, criterio, campo, valor) => {
    setEvaluaciones(prev => ({
      ...prev,
      [revision]: {
        ...prev[revision],
        [criterio]: {
          ...prev[revision][criterio],
          [campo]: valor
        }
      }
    }));
  };

  useEffect(() => {
    const savedData = localStorage.getItem(`evaluaciones-${evaluador.id}`);
    if (savedData) {
      setEvaluaciones(JSON.parse(savedData));
    }
  }, [evaluador]);

  useEffect(() => {
    localStorage.setItem(`evaluaciones-${evaluador.id}`, JSON.stringify(evaluaciones));
  }, [evaluaciones, evaluador]);

  // Componente de navegación móvil
  const MobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around p-2">
        <button
          onClick={() => setActiveRevision('revision1')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
            activeRevision === 'revision1' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
          }`}
        >
          Revisión 1 (40%)
        </button>
        <button
          onClick={() => setActiveRevision('revision2')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
            activeRevision === 'revision2' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
          }`}
        >
          Revisión 2 (60%)
        </button>
      </div>
    </div>
  );

  const RenderRevision = ({ revisionNum, data }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8 ${
      activeRevision !== `revision${revisionNum}` ? 'hidden lg:block' : ''
    }`}>
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          Revisión {revisionNum} ({revisionNum === 1 ? '40%' : '60%'})
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Evaluador: {evaluador.nombre}</p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(criterios).map(([key, descripcion]) => (
          <div key={key} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <label className="block text-base sm:text-lg font-medium mb-2">{descripcion}</label>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-2">
              {['insuficiente', 'suficiente', 'excelente'].map((valor) => (
                <label key={valor} className="flex items-center space-x-2 text-sm sm:text-base">
                  <input
                    type="radio"
                    name={`${key}-${revisionNum}`}
                    value={valor}
                    checked={data[key].valor === valor}
                    onChange={(e) => 
                      handleEvaluacionChange(`revision${revisionNum}`, key, 'valor', e.target.value)
                    }
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{valor}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Observaciones..."
              value={data[key].observaciones}
              onChange={(e) => 
                handleEvaluacionChange(`revision${revisionNum}`, key, 'observaciones', e.target.value)
              }
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              rows="2"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl pb-16 lg:pb-4">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Evaluación de Tesis
      </h1>
      
      <RenderRevision revisionNum={1} data={evaluaciones.revision1} />
      <RenderRevision revisionNum={2} data={evaluaciones.revision2} />
      
      <MobileNav />
    </div>
  );
};

export default RubricasTesis;
