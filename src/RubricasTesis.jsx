import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Menu, X } from 'lucide-react';

const RubricasTesis = ({ evaluador }) => {
  const [activeRevision, setActiveRevision] = useState('revision1');
  
  const criterios = [
    'Presentación audiovisual',
    'Investigación y sustento del tema',
    'Solución de diseño propuesta',
    'Cumplimiento de entregables'
  ];

  const valoraciones = {
    insuficiente: 1,
    suficiente: 2,
    excelente: 3
  };

  const [evaluaciones, setEvaluaciones] = useState({
    revision1: {},
    revision2: {}
  });

  useEffect(() => {
    const savedData = localStorage.getItem(`evaluaciones-${evaluador.id}`);
    if (savedData) {
      setEvaluaciones(JSON.parse(savedData));
    }
  }, [evaluador.id]);

  useEffect(() => {
    localStorage.setItem(`evaluaciones-${evaluador.id}`, JSON.stringify(evaluaciones));
  }, [evaluaciones, evaluador.id]);

  const calcularPuntajePresentacion = (calificaciones) => {
    const valores = Object.values(calificaciones);
    if (valores.length === 0) return 0;
    const suma = valores.reduce((acc, val) => acc + valoraciones[val], 0);
    const maximo = criterios.length * 3;
    return (suma / maximo) * 10;
  };

  const calcularPuntajeFinal = () => {
    const puntaje1 = calcularPuntajePresentacion(evaluaciones.revision1) * 0.4;
    const puntaje2 = calcularPuntajePresentacion(evaluaciones.revision2) * 0.6;
    return puntaje1 + puntaje2;
  };

  const handleCalificacion = (revision, criterio, valor) => {
    setEvaluaciones(prev => ({
      ...prev,
      [revision]: {
        ...prev[revision],
        [criterio]: valor
      }
    }));
  };

  const renderBotonValoracion = (revision, criterio, valor) => {
    const isSelected = evaluaciones[revision][criterio] === valor;
    
    return (
      <button
        key={valor}
        onClick={() => handleCalificacion(revision, criterio, valor)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isSelected ? 
            'bg-blue-600 text-white' : 
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        {valor.charAt(0).toUpperCase() + valor.slice(1)}
      </button>
    );
  };

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
          Presentación 1 (40%)
        </button>
        <button
          onClick={() => setActiveRevision('revision2')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
            activeRevision === 'revision2' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
          }`}
        >
          Presentación 2 (60%)
        </button>
      </div>
    </div>
  );

  const puntajeFinal = calcularPuntajeFinal();
  const aprobado = puntajeFinal >= 8;

  const RenderRevision = ({ revisionNum }) => {
    const revision = `revision${revisionNum}`;
    return (
      <Card className={`mb-6 ${activeRevision !== revision ? 'hidden lg:block' : ''}`}>
        <CardHeader>
          <CardTitle>
            Presentación {revisionNum} ({revisionNum === 1 ? '40%' : '60%'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criterios.map((criterio, index) => (
              <div key={criterio} className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">{criterio}</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(valoraciones).map(valor => 
                    renderBotonValoracion(revision, `criterio${index + 1}`, valor)
                  )}
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">
                Puntaje: {calcularPuntajePresentacion(evaluaciones[revision]).toFixed(2)}/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl pb-16 lg:pb-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sistema de Calificación de Presentaciones de Tesis</CardTitle>
        </CardHeader>
      </Card>

      <RenderRevision revisionNum={1} />
      <RenderRevision revisionNum={2} />

      <Card>
        <CardContent className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Puntaje Final: {puntajeFinal.toFixed(2)}/10</h2>
            {aprobado ? (
              <CheckCircle2 className="text-green-500 w-6 h-6" />
            ) : (
              <AlertCircle className="text-red-500 w-6 h-6" />
            )}
          </div>
          <p className={`text-lg ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
            {aprobado 
              ? 'El estudiante puede pasar a su defensa privada' 
              : 'El estudiante aún no alcanza el puntaje mínimo requerido (8/10)'}
          </p>
        </CardContent>
      </Card>

      <MobileNav />
    </div>
  );
};

export default RubricasTesis;
