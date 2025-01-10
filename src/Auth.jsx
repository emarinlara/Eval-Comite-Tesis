import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Lista de evaluadores permitidos
  const evaluadores = [
    { email: 'profesor1@tesis.com', password: 'evaluador123', nombre: 'Dr. Juan Pérez' },
    { email: 'profesor2@tesis.com', password: 'evaluador123', nombre: 'Dra. María García' },
    { email: 'profesor3@tesis.com', password: 'evaluador123', nombre: 'Dr. Carlos López' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const evaluador = evaluadores.find(ev => 
      ev.email === formData.email && ev.password === formData.password
    );

    if (evaluador) {
      onLogin({
        id: evaluador.email.split('@')[0],
        nombre: evaluador.nombre
      });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Sistema de Evaluación de Tesis</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Ingrese sus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border rounded-md text-sm sm:text-base"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 text-sm sm:text-base font-medium"
          >
            Ingresar
          </button>
        </form>
        
        <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Credenciales de prueba:</p>
          <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
            {evaluadores.map(ev => (
              <li key={ev.email} className="truncate">{ev.nombre}: {ev.email}</li>
            ))}
            <li className="mt-1">Contraseña: evaluador123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Auth;
