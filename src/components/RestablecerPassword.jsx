import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { restablecerPasswordRequest } from '../services/authService';

export default function RestablecerPassword({ token, onTerminar }) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await restablecerPasswordRequest(token, password);
      setListo(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo restablecer la contraseña. Inténtalo de nuevo.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const claseInput =
    'w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition';

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Nueva contraseña</h2>
        <p className="text-base text-slate-500 mt-3">Elige una contraseña de al menos 8 caracteres</p>
      </div>

      {listo ? (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-emerald-800">Contraseña actualizada</p>
          <p className="mt-1 text-sm text-emerald-700">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <button
            type="button"
            onClick={onTerminar}
            className="mt-5 w-full py-3 rounded-xl bg-linear-to-r from-[#15803d] to-[#16a34a] text-white font-bold shadow-lg shadow-emerald-700/25 hover:brightness-105 transition"
          >
            Ir a iniciar sesión
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nueva-password" className="block text-sm font-semibold text-slate-600 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="nueva-password"
                type={mostrar ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={claseInput}
              />
              <button
                type="button"
                onClick={() => setMostrar(!mostrar)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmar-password" className="block text-sm font-semibold text-slate-600 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="confirmar-password"
                type={mostrar ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
                className={claseInput}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#15803d] to-[#16a34a] text-white text-base font-bold shadow-lg shadow-emerald-700/25 hover:brightness-105 transition disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-300 pt-8">
        © 2026 AGROSOFT · Sistema de Gestión Agrícola
      </p>
    </div>
  );
}
