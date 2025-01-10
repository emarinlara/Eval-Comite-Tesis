import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

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

  // Cargar evaluaciones guardadas
  useEffect(() => {
    const savedData = localStorage.getItem(`evaluaciones-${evaluador.id}`);
    if (savedData) {
      setEvaluaciones(JSON.parse(savedData));
    }
  }, [evaluador]);

  // Guardar evaluaciones
  useEffect(() => {
    localStorage.setItem(`evaluaciones-${evaluador.id}`, JSON.stringify(evaluaciones));
  }, [evaluaciones, evaluador]);

  const RenderRevision = ({ revisionNum, data }) => (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-xl font-bold">
          Revisión {revisionNum} ({revisionNum === 1 ? '40%' : '60%'})
        </h2>
        <p className="text-gray-600">Evaluador: {evaluador.nombre}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(criterios).map(([key, descripcion]) => (
          <div key={key} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <Label className="text-lg font-medium">{descripcion}</Label>
            <RadioGroup
              value={data[key].valor}
              onValueChange={(valor) => 
                handleEvaluacionChange(`revision${revisionNum}`, key, 'valor', valor)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="insuficiente" id={`${key}-insuficiente-${revisionNum}`} />
                <Label htmlFor={`${key}-insuficiente-${revisionNum}`}>Insuficiente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suficiente" id={`${key}-suficiente-${revisionNum}`} />
                <Label htmlFor={`${key}-suficiente-${revisionNum}`}>Suficiente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excelente" id={`${key}-excelente-${revisionNum}`} />
                <Label htmlFor={`${key}-excelente-${revisionNum}`}>Excelente</Label>
              </div>
            </RadioGroup>
            <Textarea
              placeholder="Observaciones..."
              value={data[key].observaciones}
              onChange={(e) => 
                handleEvaluacionChange(`revision${revisionNum}`, key, 'observaciones', e.target.value)
              }
              className="mt-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">Evaluación de Tesis</h1>
      
      {/* Primera Revisión */}
      <RenderRevision revisionNum={1} data={evaluaciones.revision1} />
      
      {/* Segunda Revisión */}
      <RenderRevision revisionNum={2} data={evaluaciones.revision2} />
    </div>
  );
};

export default RubricasTesis;
