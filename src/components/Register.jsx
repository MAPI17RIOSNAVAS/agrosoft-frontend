import { useState } from 'react';
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
  ImagePlus,
  CheckCircle2,
} from 'lucide-react';
import { crearUsuarioRequest } from '../api/usuarios.api';

export default function CrearUsuarioForm({ onUsuarioCreado, onVolverLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    identificacion: '',
    correo: '',
    password: '',
    confirmPassword: '',
    idFicha: '',
    telefono: '',
    programaFormacionId: '',
    rol: 'Administrador',
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (formData.password !== formData.confirmPassword) {
      setMensaje({
        tipo: 'error',
        texto: 'Las contraseñas no coinciden. Por favor, verifícalas.',
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...datosAEnviar } = formData;
      const payload = {
        ...datosAEnviar,
        idFicha: Number(datosAEnviar.idFicha),
        telefono: datosAEnviar.telefono || null,
        programaFormacionId: datosAEnviar.programaFormacionId || null,
      };

      await crearUsuarioRequest(payload);
      setMensaje({ tipo: 'exito', texto: 'Usuario creado correctamente' });

      setFormData({
        nombre: '',
        apellido: '',
        identificacion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        idFicha: '',
        telefono: '',
        programaFormacionId: '',
        rol: 'Administrador',
      });

      if (onUsuarioCreado) onUsuarioCreado();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al crear el usuario';
      setMensaje({ tipo: 'error', texto: Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'Administrador', titulo: 'Administrador' },
    { id: 'Instructor', titulo: 'Instructor' },
    { id: 'Cliente', titulo: 'Cliente' },
    { id: 'Aprendiz', titulo: 'Aprendiz' },
  ];

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

        {/* Foto de perfil compacta al costado derecho en pantallas medianas */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 transition shrink-0">
            <ImagePlus className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] text-slate-500 font-medium text-center leading-none mt-0.5">
              Foto
            </span>
          </div>
          <span className="text-xs text-slate-400 max-w-[120px] leading-tight">
            Sube una foto de perfil opcional
          </span>
        </div>
      </div>

      {mensaje.texto && (
        <div
          className={`p-3.5 rounded-xl mb-6 text-sm font-medium ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              required
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Rol solicitado: distribuido en 4 columnas en pantallas medianas */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rol solicitado</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {roles.map((item) => {
              const checked = formData.rol === item.id;
              return (
                <label
                  key={item.id}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition select-none ${
                    checked ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rol"
                    value={item.id}
                    checked={checked}
                    onChange={handleChange}
                    className="accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-800">{item.titulo}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Programa de formación e ID de ficha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Programa de formación</label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="programaFormacionId"
                value={formData.programaFormacionId}
                onChange={handleChange}
                placeholder="Ej: Gestión Agropecuaria"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">ID de ficha</label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                name="idFicha"
                required
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
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mt-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Tu solicitud será revisada por un administrador antes de activar el acceso.</span>
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