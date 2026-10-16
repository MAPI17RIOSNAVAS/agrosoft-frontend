import { useState } from 'react';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { recuperarPasswordRequest } from '../services/authService';

export default function RecuperarPassword({ onVolver, correoInicial = '' }) {
  const [correo, setCorreo] = useState(correoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await recuperarPasswordRequest(correo.trim());
      setEnviado(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.';
      setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <button
        type="button"
        onClick={onVolver}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="mt-12 mb-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Recuperar contraseña</h2>
        <p className="text-base text-slate-500 mt-3">
          Ingresa tu correo y recibirás las instrucciones
        </p>
      </div>

      {enviado ? (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <MailCheck className="w-8 h-8 mx-auto text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-emerald-800">Revisa tu correo</p>
          <p className="mt-1 text-sm text-emerald-700">
            Si <span className="font-semibold">{correo}</span> está registrado, te enviamos las
            instrucciones para restablecer tu contraseña.
          </p>
          <button
            type="button"
            onClick={onVolver}
            className="mt-4 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Volver a iniciar sesión
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
            <label htmlFor="correo-recuperar" className="block text-sm font-semibold text-slate-600 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="correo-recuperar"
                type="email"
                required
                autoFocus
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@agrosoft.co"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#15803d] to-[#16a34a] text-white text-base font-bold shadow-lg shadow-emerald-700/25 hover:brightness-105 transition disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-300 pt-8">
        © 2026 AGROSOFT · Sistema de Gestión Agrícola
      </p>
    </div>
  );
}
