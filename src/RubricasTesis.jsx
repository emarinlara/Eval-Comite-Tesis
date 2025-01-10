import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';

const RubricasTesis = ({ initialData, onDataChange }) => {
  const evaluadores = [1, 2, 3];
  
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

  const [calificacionesEvaluadores, setCalificacionesEvaluadores] = useState(
    initialData || evaluadores.reduce((acc, evaluador) => ({
      ...acc,
      [evaluador]: {
        presentacion1: {},
        presentacion2: {},
        observaciones1: {},
        observaciones2: {}
      }
    }), {})
  );

  useEffect(() => {
    if (onDataChange) {
      onDataChange(calificacionesEvaluadores);
    }
  }, [calificacionesEvaluadores, onDataChange]);

  const calcularPuntajePresentacion = (calificaciones) => {
    if (Object.keys(calificaciones).length === 0) return 0;
    const suma = Object.values(calificaciones).reduce((acc, val) => acc + valoraciones[val], 0);
    const maximo = criterios.length * 3;
    return (suma / maximo) * 10;
  };

  const calcularPromedioComite = () => {
    const promedios = evaluadores.map(evaluador => {
      const puntaje1 = calcularPuntajePresentacion(calificacionesEvaluadores[evaluador].presentacion1) * 0.4;
      const puntaje2 = calcularPuntajePresentacion(calificacionesEvaluadores[evaluador].presentacion2) * 0.6;
      return puntaje1 + puntaje2;
    });
    
    const sumaPromedios = promedios.reduce((acc, val) => acc + val, 0);
    return sumaPromedios / evaluadores.length;
  };

  const handleCalificacion = (evaluador, presentacion, criterio, valor) => {
    setCalificacionesEvaluadores(prev => ({
      ...prev,
      [evaluador]: {
        ...prev[evaluador],
        [`presentacion${presentacion}`]: {
          ...prev[evaluador][`presentacion${presentacion}`],
          [criterio]: valor
        }
      }
    }));
  };

  const handleObservacion = (evaluador, presentacion, criterio, observacion) => {
    setCalificacionesEvaluadores(prev => ({
      ...prev,
      [evaluador]: {
        ...prev[evaluador],
        [`observaciones${presentacion}`]: {
          ...prev[evaluador][`observaciones${presentacion}`],
          [criterio]: observacion
        }
      }
    }));
  };

  const renderBotonValoracion = (evaluador, presentacion, criterio, valor) => {
    const isSelected = calificacionesEvaluadores[evaluador][`presentacion${presentacion}`][criterio] === valor;
    
    return (
      <button
        onClick={() => handleCalificacion(evaluador, presentacion, criterio, valor)}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
          ${isSelected ? 
            'bg-blue-600 text-white' : 
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        {valor.charAt(0).toUpperCase() + valor.slice(1)}
      </button>
    );
  };

  const puntajeFinal = calcularPromedioComite();
  const aprobado = puntajeFinal >= 8;

  return (
    <div className="space-y-8">
      {evaluadores.map(evaluador => (
        <Card key={evaluador} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6" />
              <CardTitle>Evaluador {evaluador}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {[1, 2].map(presentacion => (
                <div key={presentacion} className="space-y-6">
                  <h2 className="text-lg font-bold border-b pb-2">
                    Presentación {presentacion} ({presentacion === 1 ? '40%' : '60%'})
                  </h2>
                  <div className="space-y-6">
                    {criterios.map(criterio => (
                      <div key={criterio} className="space-y-3">
                        <h3 className="font-medium">{criterio}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(valoraciones).map(valor => (
                            renderBotonValoracion(evaluador, presentacion, criterio, valor)
                          ))}
                        </div>
                        <textarea
                          placeholder="Observaciones..."
                          className="w-full p-2 border rounded-lg text-sm"
                          value={calificacionesEvaluadores[evaluador][`observaciones${presentacion}`][criterio] || ''}
                          onChange={(e) => handleObservacion(evaluador, presentacion, criterio, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      Puntaje Presentación {presentacion}:{' '}
                      {calcularPuntajePresentacion(calificacionesEvaluadores[evaluador][`presentacion${presentacion}`]).toFixed(2)}/10
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Promedio Final del Comité: {puntajeFinal.toFixed(2)}/10</h2>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RubricasTesis;
