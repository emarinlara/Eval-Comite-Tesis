import React, { useState, useEffect } from 'react';

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

  const RenderRevision = ({ revisionNum, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Revisión {revisionNum} ({revisionNum === 1 ? '40%' : '60%'})
        </h2>
        <p className="text-gray-600">Evaluador: {evaluador.nombre}</p>
      </div>
      <div className="space-y-6">
        {Object.entries(criterios).map(([key, descripcion]) => (
          <div key={key} className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-lg font-medium mb-2">{descripcion}</label>
            <div className="flex space-x-4 mb-2">
              {['insuficiente', 'suficiente', 'excelente'].map((valor) => (
                <label key={valor} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${key}-${revisionNum}`}
                    value={valor}
                    checked={data[key].valor === valor}
                    onChange={(e) => 
                      handleEvaluacionChange(`revision${revisionNum}`, key, 'valor', e.target.value)
                    }
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
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">Evaluación de Tesis</h1>
      
      <RenderRevision revisionNum={1} data={evaluaciones.revision1} />
      <RenderRevision revisionNum={2} data={evaluaciones.revision2} />
    </div>
  );
};

export default RubricasTesis;
