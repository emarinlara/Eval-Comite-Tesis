import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, LogOut, Save, User } from 'lucide-react';
import Auth from './Auth';
import RubricasTesis from './RubricasTesis';

// Simulación de base de datos
const localDB = {
  saveEvaluation: (data) => {
    localStorage.setItem(`evaluation_${data.id}`, JSON.stringify(data));
    return Promise.resolve({ success: true });
  },
  getEvaluation: (id) => {
    const data = localStorage.getItem(`evaluation_${id}`);
    return Promise.resolve(data ? JSON.parse(data) : null);
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    // Cargar datos guardados al iniciar
    const loadSavedData = async () => {
      if (user) {
        const saved = await localDB.getEvaluation(user.id);
        if (saved) {
          setEvaluationData(saved.evaluationData);
        }
      }
    };
    loadSavedData();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setEvaluationData(null);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await localDB.saveEvaluation({
        id: user.id,
        evaluationData: data,
        timestamp: new Date().toISOString()
      });
      setSavedMessage('Evaluación guardada correctamente');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      setSavedMessage('Error al guardar la evaluación');
    }
    setSaving(false);
  };

  const generatePDF = () => {
    const content = document.getElementById('evaluation-content');
    if (!content) return;

    // Aquí iría la lógica de generación de PDF
    // Por ahora solo simularemos la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Contenido del PDF'));
    element.setAttribute('download', 'evaluacion_tesis.pdf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2" />
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleSave(evaluationData)}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {savedMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {savedMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" id="evaluation-content">
        <RubricasTesis 
          initialData={evaluationData}
          onDataChange={setEvaluationData}
        />
      </main>
    </div>
  );
};

export default App;
