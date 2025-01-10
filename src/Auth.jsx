import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Auth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
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
      // Pasamos tanto el ID como el nombre real del evaluador
      onLogin({
        id: evaluador.email.split('@')[0],  // profesor1, profesor2, etc.
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Sistema de Evaluación de Tesis</h2>
          <p className="text-gray-600">Ingrese sus credenciales</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Credenciales de prueba:</p>
            <ul className="text-sm text-gray-500">
              {evaluadores.map(ev => (
                <li key={ev.email}>{ev.nombre}: {ev.email}</li>
              ))}
              <li className="mt-1">Contraseña: evaluador123</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
