import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { loginRequest } from '../services/authService';

export default function LoginF({ onLoginSuccess, onIrRegistro }) {
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    recordarme: false,
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginRequest(formData.correo, formData.password);
      const tokenRecibido = data.token || data.access_token;

      if (tokenRecibido) {
        localStorage.setItem('token', tokenRecibido);

        // Extraemos la parte central del JWT (payload en base64) de forma nativa
        let payload = {};
        try {
          const base64Url = tokenRecibido.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          payload = JSON.parse(window.atob(base64));
        } catch (err) {
          console.error("Error al leer payload:", err);
        }

        // 1. Extraemos el correo del token o del formulario
        const correoUsuario = payload.email || formData.correo || 'Usuario';
        
        // 2. Generamos un nombre legible basado en el correo (ej: "carlos.perez@..." -> "Carlos")
        const nombreExtraido = payload.nombre || payload.name || data.nombre || 
          correoUsuario.split('@')[0].replace(/[._]/g, ' ');

        const usuarioAEnviar = {
          token: tokenRecibido,
          nombre: nombreExtraido.charAt(0).toUpperCase() + nombreExtraido.slice(1),
          rol: payload.rol || payload.role || data.rol || 'rol', 
        };

        if (onLoginSuccess) onLoginSuccess(usuarioAEnviar);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Credenciales incorrectas o error en el servidor';
      setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Iniciar sesión</h2>
        <p className="text-sm text-slate-500 mt-1.5">Accede a tu cuenta de AGROSOFT</p>
      </div>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Correo Electrónico */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@agrosoft.co"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={mostrarPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Recordarme y Recuperar Contraseña */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              name="recordarme"
              checked={formData.recordarme}
              onChange={handleChange}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            Recordarme
          </label>
          <button
            type="button"
            className="text-emerald-700 font-semibold hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón Principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#15803d] hover:bg-[#166534] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-sm disabled:opacity-50 text-sm"
        >
          <span>{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Separador */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium">o</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Enlace hacia Registro */}
        <p className="text-center text-xs text-slate-500">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onIrRegistro}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Regístrate aquí
          </button>
        </p>

        <p className="text-center text-[11px] text-slate-400 pt-6">
          © 2026 AGROSOFT · Sistema de Gestión Agrícola
        </p>
      </form>
    </div>
  );
}