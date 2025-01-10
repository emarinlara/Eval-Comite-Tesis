import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import RubricasTesis from './RubricasTesis';

function App() {
  const [evaluador, setEvaluador] = useState(null);

  // Intentar recuperar la sesión del evaluador al cargar
  useEffect(() => {
    const savedEvaluador = localStorage.getItem('evaluadorActual');
    if (savedEvaluador) {
      setEvaluador(JSON.parse(savedEvaluador));
    }
  }, []);

  const handleLogin = (datosEvaluador) => {
    setEvaluador(datosEvaluador);
    localStorage.setItem('evaluadorActual', JSON.stringify(datosEvaluador));
  };

  const handleLogout = () => {
    setEvaluador(null);
    localStorage.removeItem('evaluadorActual');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!evaluador ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <div>
          <div className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div>
                <span className="font-medium">Evaluador:</span> {evaluador.nombre}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          <RubricasTesis evaluador={evaluador} />
        </div>
      )}
    </div>
  );
}

export default App;
