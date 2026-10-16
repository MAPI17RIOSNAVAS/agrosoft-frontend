import { useState, useEffect } from 'react';
import LoginT from './components/LoginT';
import LoginF from './components/LoginF';
import CrearUsuarioForm from './components/Register';
import Dashboard from './components/Dashboard';
import RecuperarPassword from './components/RecuperarPassword';
import RestablecerPassword from './components/RestablecerPassword';

export default function App() {
  // Enlace del correo de recuperación: /restablecer-password?token=...
  const [tokenRestablecer] = useState(() =>
    window.location.pathname === '/restablecer-password'
      ? new URLSearchParams(window.location.search).get('token')
      : null
  );
  // 'login' | 'registro' | 'recuperar' | 'restablecer' | 'dashboard'
  const [vista, setVista] = useState(tokenRestablecer ? 'restablecer' : 'login');
  const [usuario, setUsuario] = useState(null);
  const [correoRegistrado, setCorreoRegistrado] = useState('');
  const [correoRecuperar, setCorreoRecuperar] = useState('');

  // Mantener sesión si ya existe un token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && !tokenRestablecer) {
      if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
      setVista('dashboard');
    }
  }, [tokenRestablecer]);

  // Función ejecutada cuando el Login tiene éxito
  const handleLoginSuccess = (data) => {
    setUsuario(data.usuario || data);
    localStorage.setItem('usuario', JSON.stringify(data.usuario || data));
    setCorreoRegistrado('');
    // Redirige directamente al Dashboard
    setVista('dashboard');
  };

  // Refleja en la sesión los cambios hechos desde "Mi Perfil"
  const handleUsuarioActualizado = (cambios) => {
    setUsuario((prev) => {
      const actualizado = { ...prev, ...cambios };
      localStorage.setItem('usuario', JSON.stringify(actualizado));
      return actualizado;
    });
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setVista('login');
  };

  // 1. VISTA DASHBOARD (cuando la sesión está iniciada)
  if (vista === 'dashboard') {
    return <Dashboard usuario={usuario} onLogout={handleLogout} onUsuarioActualizado={handleUsuarioActualizado} />;
  }

  // 2. VISTAS DE AUTENTICACIÓN (Login y Registro)
  return (
    // h-screen y overflow-hidden evitan que la página entera haga scroll
    <div className="h-screen w-full flex bg-green-50 font-sans overflow-hidden">
      {/* 1. Barra lateral verde: permanece fija e inmóvil */}
      <LoginT />

      {/* 2. Sección derecha: con 'overflow-y-auto' solo esta columna se desplaza */}
      <main className="flex-1 h-full overflow-y-auto flex items-center justify-center p-6 lg:p-12">
        <div
          className={`w-full bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-slate-100 my-auto transition-all duration-300 ${
            vista === 'registro' ? 'max-w-5xl' : 'max-w-md'
          }`}
        >
          {vista === 'restablecer' ? (
            <RestablecerPassword
              token={tokenRestablecer}
              onTerminar={() => {
                window.history.replaceState(null, '', '/');
                setVista('login');
              }}
            />
          ) : vista === 'recuperar' ? (
            <RecuperarPassword
              correoInicial={correoRecuperar}
              onVolver={() => setVista('login')}
            />
          ) : vista === 'login' ? (
            <LoginF
              onLoginSuccess={handleLoginSuccess}
              onIrRecuperar={(correo) => {
                setCorreoRecuperar(correo);
                setVista('recuperar');
              }}
              onIrRegistro={() => {
                setCorreoRegistrado('');
                setVista('registro');
              }}
              correoInicial={correoRegistrado}
            />
          ) : (
            <CrearUsuarioForm
              onUsuarioCreado={(correo) => {
                setCorreoRegistrado(correo);
                setVista('login');
              }}
              onVolverLogin={() => setVista('login')}
            />
          )}
        </div>
      </main>
    </div>
  );
}