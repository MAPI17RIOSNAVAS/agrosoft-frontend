import { useRef, useState } from 'react';
import { Pencil, Lock, Camera } from 'lucide-react';
import { actualizarUsuarioRequest } from '../api/usuarios.api';
import { archivoADataUrlCuadrado, TIPOS_IMAGEN_PERMITIDOS } from '../utils/imagen';
import CambiarPasswordModal from '../components/CambiarPasswordModal';

// Datos de ejemplo: aún no hay un endpoint de actividad en el backend
const ACTIVIDAD_RECIENTE = [
  { titulo: 'Inicio de sesión', detalle: 'Chrome / Windows · IP: 192.168.1.10', fecha: '10/08/2026 08:45' },
  { titulo: 'Registro de actividad', detalle: 'Chrome / Windows · IP: 192.168.1.10', fecha: '09/08/2026 16:30' },
  { titulo: 'Actualización de incidencia', detalle: 'Chrome / Windows · IP: 192.168.1.10', fecha: '09/08/2026 14:15' },
  { titulo: 'Inicio de sesión', detalle: 'Safari / iPhone · IP: 192.168.1.10', fecha: '09/08/2026 08:00' },
];

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const textoUltimaModificacion = (fecha) => {
  if (!fecha) return 'Sin cambios registrados';
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / MS_POR_DIA);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
};

const datosEditables = (usuario) => ({
  nombre: usuario?.nombre ?? '',
  apellido: usuario?.apellido ?? '',
  telefono: usuario?.telefono ?? '',
  fotoPerfil: usuario?.fotoPerfil ?? null,
});

function Campo({ label, valor, noEditable, badgeVerde }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-600 mb-1.5">{label}</p>
      <div className="flex items-center gap-2 h-10.5 px-3 bg-[#f5f7f5] border border-slate-100 rounded-lg">
        <span className={`text-[15px] truncate ${noEditable ? 'text-slate-400' : 'text-slate-700'}`}>
          {valor || '—'}
        </span>
        {noEditable && (
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] ${
              badgeVerde ? 'bg-[#e3f5d7] text-[#1e5c0b] font-medium' : 'bg-slate-100 text-slate-400'
            }`}
          >
            No editable
          </span>
        )}
      </div>
    </div>
  );
}

function CampoEditable({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10.5 px-3 bg-[#fafbfa] border border-slate-200 rounded-lg text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3aa60c]/20 focus:border-[#3aa60c] transition"
      />
    </div>
  );
}

function Perfil({ usuario, onUsuarioActualizado }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(() => datosEditables(usuario));
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState([]);
  const [exito, setExito] = useState('');
  const [arrastrando, setArrastrando] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const archivoRef = useRef(null);

  // En edición se previsualizan los datos del formulario
  const vista = editando ? { ...usuario, ...form } : usuario;
  const nombreCompleto = [vista?.nombre, vista?.apellido].filter(Boolean).join(' ') || 'Usuario';
  const iniciales = (
    vista?.apellido ? `${vista.nombre?.[0] ?? ''}${vista.apellido[0]}` : nombreCompleto.substring(0, 2)
  ).toUpperCase();
  const rol = usuario?.rolLabel || usuario?.rol || 'Sin rol';
  const estado = usuario?.estado ? usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1) : 'Activo';

  const iniciarEdicion = () => {
    setForm(datosEditables(usuario));
    setErrores([]);
    setExito('');
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setErrores([]);
    setEditando(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cargarFoto = (archivo) => {
    archivoADataUrlCuadrado(archivo)
      .then((fotoPerfil) => {
        setForm((prev) => ({ ...prev, fotoPerfil }));
        setErrores([]);
      })
      .catch((error) => setErrores([error.message]));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    cargarFoto(e.dataTransfer.files?.[0]);
  };

  const guardarCambios = async () => {
    const nuevosErrores = [];
    if (!form.nombre.trim()) nuevosErrores.push('El nombre es obligatorio.');
    if (!form.apellido.trim()) nuevosErrores.push('El apellido es obligatorio.');
    if (nuevosErrores.length) {
      setErrores(nuevosErrores);
      return;
    }
    if (!usuario?.id) {
      setErrores(['No se encontró el usuario de la sesión. Cierra sesión y vuelve a ingresar.']);
      return;
    }

    const cambios = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim() || null,
      fotoPerfil: form.fotoPerfil || null,
    };

    setGuardando(true);
    setErrores([]);
    try {
      await actualizarUsuarioRequest(usuario.id, cambios);
      onUsuarioActualizado?.(cambios);
      setEditando(false);
      setExito('Perfil actualizado correctamente.');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'No se pudieron guardar los cambios';
      setErrores(Array.isArray(mensaje) ? mensaje : [mensaje]);
    } finally {
      setGuardando(false);
    }
  };

  const handlePasswordCambiada = ({ passwordActualizadoAt }) => {
    onUsuarioActualizado?.({ passwordActualizadoAt });
    setModalPassword(false);
    setExito('Contraseña actualizada correctamente.');
  };

  return (
    <div className="max-w-225 mx-auto space-y-6">
      {exito && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          {exito}
        </div>
      )}

      {/* Tarjeta principal del perfil */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-28 bg-linear-to-r from-[#1d5c00] via-[#2b7d05] to-[#3ba50c]" />

        <div className="px-8 pb-8">
          <div className="flex items-start gap-5">
            {/* Avatar sobre el banner */}
            <div className="relative -mt-13.25 shrink-0">
              {vista?.fotoPerfil ? (
                <img
                  src={vista.fotoPerfil}
                  alt={`Foto de ${nombreCompleto}`}
                  className="w-22.5 h-22.5 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-22.5 h-22.5 rounded-full bg-[#21a04a] border-4 border-white shadow-md flex items-center justify-center">
                  <span className="font-outfit text-3xl font-bold text-white">{iniciales}</span>
                </div>
              )}
              {editando && (
                <button
                  type="button"
                  onClick={() => archivoRef.current?.click()}
                  className="absolute bottom-0 right-0 w-6.5 h-6.5 rounded-full bg-[#21a04a] border-2 border-white flex items-center justify-center text-white hover:bg-[#1b8a3f] transition"
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Nombre (sobre el borde del banner) y etiquetas */}
            <div className="-mt-7.5 min-w-0 flex-1">
              <h1 className="font-outfit text-[22px] font-bold text-[#1a4d0a] leading-7 truncate">{nombreCompleto}</h1>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="px-3 py-1 rounded-full bg-[#e3f5d7] text-[#1e5c0b] text-xs font-semibold">{rol}</span>
                <span className="px-3 py-1 rounded-full bg-[#e3f5d7] text-[#1e5c0b] text-xs font-semibold">{estado}</span>
              </div>
            </div>

            {editando ? (
              <div className="-mt-0.75 shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  disabled={guardando}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarCambios}
                  disabled={guardando}
                  className="px-5 py-2.5 bg-[#3aa60c] hover:bg-[#33940a] rounded-lg text-sm font-bold text-white transition disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={iniciarEdicion}
                className="-mt-0.75 shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#2f9a1c] text-[#2f8f17] rounded-lg text-sm font-semibold hover:bg-[#f2faee] transition"
              >
                <Pencil className="w-4 h-4" />
                Editar perfil
              </button>
            )}
          </div>

          {errores.length > 0 && (
            <ul className="mt-6 p-3 pl-7 list-disc rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-0.5">
              {errores.map((texto) => (
                <li key={texto}>{texto}</li>
              ))}
            </ul>
          )}

          {/* Datos del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4.5 gap-y-6 mt-8">
            {editando ? (
              <>
                <CampoEditable label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
                <CampoEditable label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} />
              </>
            ) : (
              <>
                <Campo label="Nombre" valor={usuario?.nombre} />
                <Campo label="Apellido" valor={usuario?.apellido} />
              </>
            )}
            <Campo label="Correo electrónico" valor={usuario?.correo} noEditable badgeVerde />
            {editando ? (
              <CampoEditable
                label="Teléfono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="300 000 0000"
              />
            ) : (
              <Campo label="Teléfono" valor={usuario?.telefono} />
            )}
            <Campo label="Identificación" valor={usuario?.identificacion} noEditable />
            <Campo label="Rol" valor={rol} />

            {editando && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-slate-600 mb-1.5">Foto de perfil</p>
                <button
                  type="button"
                  onClick={() => archivoRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setArrastrando(true);
                  }}
                  onDragLeave={() => setArrastrando(false)}
                  onDrop={handleDrop}
                  className={`w-full h-15.5 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition ${
                    arrastrando
                      ? 'border-[#3aa60c] bg-[#f2faee] text-[#2f8f17]'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {form.fotoPerfil && form.fotoPerfil !== usuario?.fotoPerfil
                    ? 'Foto nueva seleccionada · haz clic para cambiarla'
                    : 'Haz clic para subir una foto o arrastra aquí'}
                </button>
                {form.fotoPerfil && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, fotoPerfil: null })}
                    className="mt-1.5 text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            ref={archivoRef}
            type="file"
            accept={TIPOS_IMAGEN_PERMITIDOS.join(',')}
            onChange={(e) => {
              cargarFoto(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>
      </section>

      {/* Seguridad */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
        <h2 className="font-outfit text-base font-bold text-[#1a4d0a] mb-5">Seguridad</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-[#f5f7f5] border border-slate-100 rounded-xl">
          <div>
            <p className="text-[15px] font-semibold text-slate-700">Contraseña</p>
            <p className="text-sm text-slate-400 mt-0.5">
              Última modificación: {textoUltimaModificacion(usuario?.passwordActualizadoAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setExito('');
              setModalPassword(true);
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <Lock className="w-4 h-4" />
            Cambiar contraseña
          </button>
        </div>
      </section>

      {/* Actividad reciente */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
        <h2 className="font-outfit text-base font-bold text-[#1a4d0a] mb-4">Actividad Reciente</h2>
        <ul className="divide-y divide-slate-100">
          {ACTIVIDAD_RECIENTE.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[15px] text-slate-700">{item.titulo}</p>
                <p className="text-xs text-slate-400 mt-1">{item.detalle}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{item.fecha}</span>
            </li>
          ))}
        </ul>
      </section>

      {modalPassword && (
        <CambiarPasswordModal
          onCerrar={() => setModalPassword(false)}
          onPasswordCambiada={handlePasswordCambiada}
        />
      )}
    </div>
  );
}

export default Perfil;
