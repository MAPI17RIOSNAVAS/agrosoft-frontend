import { useEffect, useState } from 'react';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  BookOpen,
  Hash,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import {
  crearUsuarioRequest,
  obtenerProgramasFormacionOpcionesRequest,
  obtenerRolesOpcionesRequest,
} from '../api/usuarios.api';
import FotoPerfilInput from './FotoPerfilInput';

const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  identificacion: '',
  correo: '',
  password: '',
  confirmPassword: '',
  idFicha: '',
  telefono: '',
  programaFormacion: '',
  rol: 'APRENDIZ',
  fotoPerfil: '',
};

const selectClassName =
  'w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:bg-slate-50 disabled:text-slate-400';

export default function CrearUsuarioForm({ onUsuarioCreado, onVolverLogin }) {
  const [formData, setFormData] = useState(FORM_INICIAL);

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // texto puede ser un string o un array de mensajes del backend
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [roles, setRoles] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  useEffect(() => {
    Promise.all([obtenerRolesOpcionesRequest(), obtenerProgramasFormacionOpcionesRequest()])
      .then(([rolesOpciones, programasOpciones]) => {
        setRoles(rolesOpciones);
        setProgramas(programasOpciones);
      })
      .catch(() => {
        setMensaje({
          tipo: 'error',
          texto: 'No se pudieron cargar los roles y programas de formación. Recarga la página.',
        });
      })
      .finally(() => setCargandoOpciones(false));
  }, []);

  // Sin rol elegido, el backend asume APRENDIZ
  const esAprendiz = !formData.rol || formData.rol === 'APRENDIZ';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    const errores = [];
    if (formData.password !== formData.confirmPassword) {
      errores.push('Las contraseñas no coinciden. Por favor, verifícalas.');
    }
    if (esAprendiz && !formData.programaFormacion) {
      errores.push('El programa de formación es obligatorio para aprendices.');
    }
    if (esAprendiz && formData.idFicha === '') {
      errores.push('El ID de ficha es obligatorio para aprendices.');
    }
    if (formData.idFicha !== '' && !Number.isInteger(Number(formData.idFicha))) {
      errores.push('El ID de ficha debe ser un número entero.');
    }
    if (errores.length) {
      setMensaje({ tipo: 'error', texto: errores });
      return;
    }

    setLoading(true);

    try {
      await crearUsuarioRequest({
        nombre: formData.nombre,
        apellido: formData.apellido,
        identificacion: formData.identificacion,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono || undefined,
        rol: formData.rol || undefined,
        programaFormacion: formData.programaFormacion || undefined,
        idFicha: formData.idFicha === '' ? undefined : Number(formData.idFicha),
        fotoPerfil: formData.fotoPerfil || undefined,
      });
      setMensaje({ tipo: 'exito', texto: 'Usuario creado correctamente' });

      setFormData(FORM_INICIAL);

      // Se pasa el correo para que el login lo muestre ya escrito
      if (onUsuarioCreado) onUsuarioCreado(formData.correo);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al crear el usuario';
      setMensaje({ tipo: 'error', texto: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Ancho expandido a max-w-3xl para tomar mayor presencia
    <div className="w-full max-w-3xl mx-auto py-4">
      <button
        type="button"
        onClick={onVolverLogin}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Crear cuenta</h2>
          <p className="text-slate-500 text-sm mt-1">Completa el formulario para solicitar acceso</p>
        </div>

        {/* Foto de perfil: se puede tomar con la cámara o subir desde un archivo */}
        <FotoPerfilInput
          value={formData.fotoPerfil}
          onChange={(fotoPerfil) => setFormData((prev) => ({ ...prev, fotoPerfil }))}
        />
      </div>

      {mensaje.texto && (
        <div
          className={`p-3.5 rounded-xl mb-6 text-sm font-medium ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {Array.isArray(mensaje.texto) ? (
            <ul className="list-disc pl-5 space-y-0.5">
              {mensaje.texto.map((texto) => (
                <li key={texto}>{texto}</li>
              ))}
            </ul>
          ) : (
            mensaje.texto
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Apellido</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="apellido"
                required
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Identificación y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Identificación</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="identificacion"
                required
                value={formData.identificacion}
                onChange={handleChange}
                placeholder="Número de cédula o documento"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="300 000 0000"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Correo Electrónico a ancho completo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="correo"
              autoComplete="off"
              required
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Rol solicitado */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rol solicitado</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              disabled={cargandoOpciones}
              className={selectClassName}
            >
              {cargandoOpciones && <option value={formData.rol}>Cargando roles...</option>}
              {roles.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Programa de formación e ID de ficha: obligatorios solo para aprendices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Programa de formación{!esAprendiz && <span className="font-normal text-slate-400"> (opcional)</span>}
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                name="programaFormacion"
                required={esAprendiz}
                value={formData.programaFormacion}
                onChange={handleChange}
                disabled={cargandoOpciones}
                className={selectClassName}
              >
                <option value="">{cargandoOpciones ? 'Cargando programas...' : 'Selecciona un programa'}</option>
                {programas.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ID de ficha{!esAprendiz && <span className="font-normal text-slate-400"> (opcional)</span>}
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                name="idFicha"
                step="1"
                required={esAprendiz}
                value={formData.idFicha}
                onChange={handleChange}
                placeholder="Número de ficha SENA"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Contraseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mín. 8 caracteres"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 text-sm shadow-sm mt-3"
        >
          {loading ? 'Guardando...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}