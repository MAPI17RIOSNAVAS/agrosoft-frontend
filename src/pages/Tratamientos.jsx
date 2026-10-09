import { useState } from 'react';
import { 
  Clock, 
  XCircle, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronDown,
  X,
  AlertTriangle
} from 'lucide-react';

const DATOS_INICIALES = [
  {
    id: 1,
    tipo: 'Insecticida',
    producto: 'Imidacloprid 70%',
    unidad: 'Cultivo de Tomate Norte',
    responsable: 'Andrés Torres',
    fechaAplicacion: '2026-08-06',
    proximaAplicacion: '2026-08-13',
    cantidadNum: '150',
    unidadMedida: 'ml/100L',
    observacion: 'Aplicar en horas de la tarde. Respetar intervalo de seguridad.',
    estado: 'Activo'
  },
  {
    id: 2,
    tipo: 'Fungicida',
    producto: 'Cobre Oxicloruro 50%',
    unidad: 'Invernadero Principal',
    responsable: 'Laura Gómez',
    fechaAplicacion: '2026-08-02',
    proximaAplicacion: '2026-08-12',
    cantidadNum: '200',
    unidadMedida: 'g/100L',
    observacion: 'Segunda aplicación. Cubrir envés de hojas completamente.',
    estado: 'Próximo a vencer'
  },
  {
    id: 3,
    tipo: 'Fertilización',
    producto: 'Nitrato de Calcio',
    unidad: 'Parcela Experimental',
    responsable: 'Carlos Mendoza',
    fechaAplicacion: '2026-07-25',
    proximaAplicacion: '2026-08-25',
    cantidadNum: '5',
    unidadMedida: 'kg/1000L',
    observacion: 'Fertirrigación semanal. Ajustar según análisis foliar.',
    estado: 'Activo'
  },
  {
    id: 4,
    tipo: 'Corrección pH',
    producto: 'Ácido Fosfórico 85%',
    unidad: 'Cultivo de Lechuga Sur',
    responsable: 'Diego Hernández',
    fechaAplicacion: '2026-08-04',
    proximaAplicacion: '2026-08-07',
    cantidadNum: '10',
    unidadMedida: 'ml/100L',
    observacion: 'Ajustar a pH 5.8-6.2. Verificar conductividad eléctrica.',
    estado: 'Vencido'
  },
  {
    id: 5,
    tipo: 'Preventivo',
    producto: 'Trichoderma harzianum',
    unidad: 'Vivero Agrosoft',
    responsable: 'Patricia Ruiz',
    fechaAplicacion: '2026-07-20',
    proximaAplicacion: '2026-08-20',
    cantidadNum: '50',
    unidadMedida: 'g/mochila',
    observacion: 'Inoculación biológica de raíces al momento del trasplante.',
    estado: 'Finalizado'
  }
];

export default function Tratamientos() {
  const [tratamientos, setTratamientos] = useState(DATOS_INICIALES);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const [idEliminando, setIdEliminando] = useState(null); // Abre el modal de advertencia

  // Formulario compartido (Crear / Editar)
  const [formulario, setFormulario] = useState({
    id: null,
    unidad: 'Cultivo de Tomate Norte',
    tipo: 'Insecticida',
    producto: '',
    responsable: 'Andrés Torres',
    estado: 'Activo',
    cantidadNum: '',
    unidadMedida: 'ml/100L',
    fechaAplicacion: '2026-10-09',
    proximaAplicacion: '',
    observacion: ''
  });

  // Métricas
  const conteoActivos = tratamientos.filter(t => t.estado === 'Activo').length;
  const conteoProximos = tratamientos.filter(t => t.estado === 'Próximo a vencer').length;
  const conteoVencidos = tratamientos.filter(t => t.estado === 'Vencido').length;
  const conteoFinalizados = tratamientos.filter(t => t.estado === 'Finalizado').length;

  // Abrir modal en modo crear
  const abrirModalCrear = () => {
    setEsEdicion(false);
    setFormulario({
      id: null,
      unidad: 'Cultivo de Tomate Norte',
      tipo: 'Insecticida',
      producto: '',
      responsable: 'Andrés Torres',
      estado: 'Activo',
      cantidadNum: '',
      unidadMedida: 'ml/100L',
      fechaAplicacion: '2026-10-09',
      proximaAplicacion: '',
      observacion: ''
    });
    setModalAbierto(true);
  };

  // Abrir modal en modo edición
  const abrirModalEditar = (item) => {
    setEsEdicion(true);
    setFormulario({
      id: item.id,
      unidad: item.unidad,
      tipo: item.tipo,
      producto: item.producto,
      responsable: item.responsable,
      estado: item.estado,
      cantidadNum: item.cantidadNum,
      unidadMedida: item.unidadMedida,
      fechaAplicacion: item.fechaAplicacion,
      proximaAplicacion: item.proximaAplicacion,
      observacion: item.observacion
    });
    setModalAbierto(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = () => {
    setTratamientos(tratamientos.filter(t => t.id !== idEliminando));
    setIdEliminando(null);
  };

  // Guardar (Crear o Actualizar)
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formulario.producto) return;

    if (esEdicion) {
      setTratamientos(tratamientos.map(t => 
        t.id === formulario.id ? { ...formulario } : t
      ));
    } else {
      setTratamientos([{ ...formulario, id: Date.now() }, ...tratamientos]);
    }
    setModalAbierto(false);
  };

  const handleFinalizar = (id) => {
    setTratamientos(tratamientos.map(t => 
      t.id === id ? { ...t, estado: 'Finalizado' } : t
    ));
  };

  // Filtro
  const tratamientosFiltrados = tratamientos.filter(item => {
    const coincideTexto = 
      item.producto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.unidad.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || item.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const getBadgeYBorder = (estado) => {
    switch (estado) {
      case 'Activo':
        return {
          border: 'border-l-[#16a34a]',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'Próximo a vencer':
        return {
          border: 'border-l-[#d97706]',
          badge: 'bg-amber-50 text-amber-700 border border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'Vencido':
        return {
          border: 'border-l-[#dc2626]',
          badge: 'bg-rose-50 text-rose-700 border border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'Finalizado':
      default:
        return {
          border: 'border-l-slate-400',
          badge: 'bg-slate-100 text-slate-600 border border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. BANNERS DE ALERTA */}
      {conteoProximos > 0 && (
        <div className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <Clock className="w-5 h-5 text-[#d97706] shrink-0" />
          <p>
            <span className="font-bold">{conteoProximos} tratamiento(s)</span> próximos a vencer. Revisa y programa las próximas aplicaciones.
          </p>
        </div>
      )}

      {conteoVencidos > 0 && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <XCircle className="w-5 h-5 text-[#ef4444] shrink-0" />
          <p>
            <span className="font-bold">{conteoVencidos} tratamiento(s)</span> vencidos. Requieren atención inmediata.
          </p>
        </div>
      )}

      {/* 2. TARJETAS DE CONTEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-black text-[#15803d]">{conteoActivos}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Activo</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-black text-[#b45309]">{conteoProximos}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Próximo a vencer</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-black text-[#b91c1c]">{conteoVencidos}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Vencido</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-black text-slate-600">{conteoFinalizados}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Finalizado</p>
        </div>
      </div>

      {/* 3. BARRA DE HERRAMIENTAS */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por producto o unidad..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
          />
        </div>

        <div className="relative">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="appearance-none w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm cursor-pointer"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Próximo a vencer">Próximo a vencer</option>
            <option value="Vencido">Vencido</option>
            <option value="Finalizado">Finalizado</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={abrirModalCrear}
          className="bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Tratamiento</span>
        </button>
      </div>

      {/* 4. GRILLA DE TRATAMIENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {tratamientosFiltrados.map((item) => {
          const config = getBadgeYBorder(item.estado);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 border-l-[5px] ${config.border} flex flex-col justify-between gap-5 transition hover:shadow-md`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {item.tipo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {item.producto}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${config.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                    {item.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 mt-5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Unidad</span>
                    <span className="font-bold text-slate-800">{item.unidad}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Responsable</span>
                    <span className="font-bold text-slate-800">{item.responsable}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Aplicación</span>
                    <span className="font-bold text-slate-800">{item.fechaAplicacion}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Próxima aplicación</span>
                    <span className="font-bold text-slate-800">{item.proximaAplicacion}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px] block">Cantidad</span>
                    <span className="font-bold text-slate-800">{item.cantidadNum} {item.unidadMedida}</span>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                  {item.observacion}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => abrirModalEditar(item)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIdEliminando(item.id)}
                  className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFinalizar(item.id)}
                  disabled={item.estado === 'Finalizado'}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition ${
                    item.estado === 'Finalizado'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#15803d] hover:bg-[#166534] text-white shadow-sm'
                  }`}
                >
                  {item.estado === 'Finalizado' ? 'Tratamiento Finalizado' : 'Marcar finalizado'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MODAL FORMULARIO: REGISTRAR / EDITAR TRATAMIENTO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-7 relative max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <h2 className="text-xl font-bold text-emerald-800 tracking-tight">
                {esEdicion ? 'Editar Tratamiento' : 'Registrar Tratamiento'}
              </h2>
              <button 
                type="button"
                onClick={() => setModalAbierto(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-4">
              {/* Fila 1: Unidad Productiva */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unidad Productiva
                </label>
                <div className="relative">
                  <select
                    value={formulario.unidad}
                    onChange={(e) => setFormulario({ ...formulario, unidad: e.target.value })}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm pr-9"
                  >
                    <option value="Cultivo de Tomate Norte">Cultivo de Tomate Norte</option>
                    <option value="Invernadero Principal">Invernadero Principal</option>
                    <option value="Parcela Experimental">Parcela Experimental</option>
                    <option value="Cultivo de Lechuga Sur">Cultivo de Lechuga Sur</option>
                    <option value="Vivero Agrosoft">Vivero Agrosoft</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Fila 2: Tipo de tratamiento y Producto utilizado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tipo de tratamiento
                  </label>
                  <div className="relative">
                    <select
                      value={formulario.tipo}
                      onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value })}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm pr-9"
                    >
                      <option value="Insecticida">Insecticida</option>
                      <option value="Fungicida">Fungicida</option>
                      <option value="Fertilización">Fertilización</option>
                      <option value="Corrección pH">Corrección pH</option>
                      <option value="Preventivo">Preventivo</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Producto utilizado
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Imidacloprid 70%"
                    value={formulario.producto}
                    onChange={(e) => setFormulario({ ...formulario, producto: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Fila 3: Responsable y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Responsable
                  </label>
                  <div className="relative">
                    <select
                      value={formulario.responsable}
                      onChange={(e) => setFormulario({ ...formulario, responsable: e.target.value })}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm pr-9"
                    >
                      <option value="Andrés Torres">Andrés Torres</option>
                      <option value="Laura Gómez">Laura Gómez</option>
                      <option value="Carlos Mendoza">Carlos Mendoza</option>
                      <option value="Diego Hernández">Diego Hernández</option>
                      <option value="Patricia Ruiz">Patricia Ruiz</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      value={formulario.estado}
                      onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm pr-9"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Próximo a vencer">Próximo a vencer</option>
                      <option value="Vencido">Vencido</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Fila 4: Cantidad y Unidad de medida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cantidad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 150"
                    value={formulario.cantidadNum}
                    onChange={(e) => setFormulario({ ...formulario, cantidadNum: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Unidad de medida
                  </label>
                  <input
                    type="text"
                    placeholder="ml/100L"
                    value={formulario.unidadMedida}
                    onChange={(e) => setFormulario({ ...formulario, unidadMedida: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Fila 5: Fecha de aplicación y Próxima aplicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Fecha de aplicación
                  </label>
                  <input
                    type="date"
                    required
                    value={formulario.fechaAplicacion}
                    onChange={(e) => setFormulario({ ...formulario, fechaAplicacion: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Próxima aplicación
                  </label>
                  <input
                    type="date"
                    required
                    value={formulario.proximaAplicacion}
                    onChange={(e) => setFormulario({ ...formulario, proximaAplicacion: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Fila 6: Observaciones */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Observaciones
                </label>
                <textarea
                  rows="3"
                  placeholder="Instrucciones o notas del tratamiento..."
                  value={formulario.observacion}
                  onChange={(e) => setFormulario({ ...formulario, observacion: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm resize-none"
                ></textarea>
              </div>

              {/* Botones inferiores */}
              <div className="grid grid-cols-2 gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  {esEdicion ? 'Actualizar' : 'Registrar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL ADVERTENCIA: ELIMINAR TRATAMIENTO */}
      {idEliminando !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-7 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            
            {/* Ícono de Alerta en Rojo */}
            <div className="w-14 h-14 rounded-full bg-rose-50 text-[#dc2626] flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Textos */}
            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
              ¿Eliminar tratamiento?
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Esta acción no se puede deshacer.
            </p>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setIdEliminando(null)}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}