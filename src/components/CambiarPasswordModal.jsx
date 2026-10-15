import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cambiarPasswordRequest } from '../api/usuarios.api';

const FORM_INICIAL = { passwordActual: '', passwordNueva: '', confirmarPassword: '' };

const CAMPOS = [
  { name: 'passwordActual', label: 'Contraseña actual', autoComplete: 'current-password' },
  { name: 'passwordNueva', label: 'Nueva contraseña', autoComplete: 'new-password' },
  { name: 'confirmarPassword', label: 'Confirmar nueva contraseña', autoComplete: 'new-password' },
];

export default function CambiarPasswordModal({ onCerrar, onPasswordCambiada }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === 'Escape' && !guardando) onCerrar();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [guardando, onCerrar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = [];
    if (!form.passwordActual) nuevosErrores.push('Ingresa tu contraseña actual.');
    if (form.passwordNueva.length < 8) nuevosErrores.push('La nueva contraseña debe tener al menos 8 caracteres.');
    if (form.passwordNueva !== form.confirmarPassword) nuevosErrores.push('Las contraseñas nuevas no coinciden.');
    if (nuevosErrores.length) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores([]);
    setGuardando(true);
    try {
      const respuesta = await cambiarPasswordRequest(form.passwordActual, form.passwordNueva);
      onPasswordCambiada(respuesta);
    } catch (error) {
      const mensaje = error.response?.data?.message || 'No se pudo cambiar la contraseña';
      setErrores(Array.isArray(mensaje) ? mensaje : [mensaje]);
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4"
      onClick={() => !guardando && onCerrar()}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        autoComplete="off"
        className="w-full max-w-112.5 bg-white rounded-2xl shadow-xl p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-cambiar-password"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="titulo-cambiar-password" className="font-outfit text-xl font-bold text-[#1a4d0a]">
            Cambiar contraseña
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errores.length > 0 && (
          <ul className="mb-5 p-3 pl-7 list-disc rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-0.5">
            {errores.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        )}

        <div className="space-y-4">
          {CAMPOS.map((campo) => (
            <div key={campo.name}>
              <label htmlFor={campo.name} className="block text-sm font-semibold text-slate-600 mb-2">
                {campo.label}
              </label>
              <input
                id={campo.name}
                type="password"
                name={campo.name}
                autoComplete={campo.autoComplete}
                value={form[campo.name]}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-10.5 px-3 bg-[#f8f9f8] border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3aa60c]/20 focus:border-[#3aa60c] transition"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="flex-1 h-12 bg-white border border-slate-200 rounded-lg text-[15px] font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 h-12 bg-[#3aa60c] hover:bg-[#33940a] rounded-lg text-[15px] font-bold text-white transition disabled:opacity-60"
          >
            {guardando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}
