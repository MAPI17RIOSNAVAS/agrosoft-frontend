import { useState } from 'react';
import {
  LayoutGrid,
  Map,
  ClipboardList,
  ShieldAlert,
  Radio,
  Package,
  ShoppingCart,
  Users,
  BookOpen,
  ChartColumn,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import Logo_sena from '../assets/Logo_sena.png';
import TerritorioCultivos from '../pages/TerritorioCultivos.jsx';
import Actividades from '../pages/Actividades.jsx';
import Incidencias from '../pages/Incidencias.jsx';
import Tratamientos from '../pages/Tratamientos.jsx';
import Cosechas from '../pages/Cosechas.jsx';
import Sensores from '../pages/Sensores.jsx';
import Inventario from '../pages/Inventario.jsx';
import WikiAgronomia from '../pages/WikiAgronomia.jsx';
import Perfil from '../pages/Perfil.jsx';
import Configuracion from '../pages/Configuracion.jsx';

export default function Dashboard({ usuario, onLogout }) {
  const [menuActivo, setMenuActivo] = useState('Dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Lista de módulos principales del Sidebar
  const modulosPrincipales = [
    { id: 'Territorio', label: 'Territorio y Cultivos', icon: Map, tieneSubmenu: true },
    { id: 'Actividades', label: 'Actividades de Campo', icon: ClipboardList, tieneSubmenu: true },
    { id: 'Fitosanitario', label: 'Control Fitosanitario', icon: ShieldAlert, tieneSubmenu: true },
    { id: 'Sensores', label: 'Sensores IoT', icon: Radio, tieneSubmenu: true },
    { id: 'Inventario', label: 'Inventario e Insumos', icon: Package, tieneSubmenu: true },
    { id: 'Comercial', label: 'Comercial y Ventas', icon: ShoppingCart, tieneSubmenu: true },
    { id: 'Usuarios', label: 'Usuarios y Seguridad', icon: Users, tieneSubmenu: true },
    { id: 'Wiki', label: 'Wiki Agronómica', icon: BookOpen, tieneSubmenu: false },
    { id: 'Reportes', label: 'Reportes', icon: ChartColumn, tieneSubmenu: false },
  ];

  // Opciones fijas del pie del Sidebar
  const modulosFooter = [
    { id: 'Configuracion', label: 'Configuración', icon: Settings },
    { id: 'Perfil', label: 'Mi Perfil', icon: User },
  ];

  // Obtener el título dinámico para la cabecera
  const obtenerTituloActivo = () => {
    if (menuActivo === 'Dashboard') return 'Dashboard';
    const principal = modulosPrincipales.find((m) => m.id === menuActivo);
    if (principal) return principal.label;
    const footer = modulosFooter.find((m) => m.id === menuActivo);
    if (footer) return footer.label;
    if (menuActivo === 'Tratamientos') return 'Tratamientos';
    if (menuActivo === 'Incidencias') return 'Incidencias';
    if (menuActivo === 'Cosechas') return 'Cosechas';
    return 'Dashboard';
  };

  const tituloActivo = obtenerTituloActivo();

  // Renderizado dinámico de la página seleccionada
  const renderComponente = () => {
    switch (menuActivo) {
      case 'Territorio': return <TerritorioCultivos />;
      case 'Actividades': return <Actividades />;
      case 'Fitosanitario':
      case 'Tratamientos': return <Tratamientos />;
      case 'Incidencias': return <Incidencias />;
      case 'Cosechas': return <Cosechas />;
      case 'Sensores': return <Sensores />;
      case 'Inventario': return <Inventario />;
      case 'Wiki': return <WikiAgronomia />;
      case 'Perfil': return <Perfil />;
      case 'Configuracion': return <Configuracion />;
      case 'Comercial':
        return (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Comercial y Ventas</h2>
            <p className="text-xs text-slate-500 mt-1">Módulo de facturación, clientes y pedidos.</p>
          </div>
        );
      case 'Usuarios':
        return (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Usuarios y Seguridad</h2>
            <p className="text-xs text-slate-500 mt-1">Gestión de usuarios, aprendices y programas de formación SENA.</p>
          </div>
        );
      case 'Reportes':
        return (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Reportes y Auditoría</h2>
            <p className="text-xs text-slate-500 mt-1">Informes de producción y métricas operativas.</p>
          </div>
        );
      default:
        return dashboardHome();
    }
  };

  const dashboardHome = () => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Panel Principal</h3>
      <p className="text-sm text-slate-500 mt-1">Bienvenido a la vista general de AgroSoft.</p>
    </div>
  );

  const nombreUsuario = usuario?.nombre || 'Mariapaula navas';
  const rolUsuario = usuario?.rol || 'Administrador';

  const seleccionarOpcion = (id) => {
    setMenuActivo(id);
    setSidebarAbierto(false); // Cierra automáticamente en móvil
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-800 relative">

      {/* OVERLAY PARA MÓVILES */}
      {sidebarAbierto && (
        <div
          onClick={() => setSidebarAbierto(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 1. SIDEBAR VERDE INSTITUCIONAL */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#15733e] text-white flex flex-col justify-between shadow-2xl md:shadow-lg transition-transform duration-300 ease-in-out shrink-0 ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Encabezado Logo + Título */}
          <div className="flex items-center gap-3 px-5 pt-6 pb-5 shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img src={Logo_sena} alt="Logo SENA" className="w-full h-full object-contain"/>
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-black tracking-wide text-white">AGROSOFT</h1>
              <span className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">Sistema Agrícola</span>
            </div>

            {/* Botón de cerrar en móvil */}
            <button
              onClick={() => setSidebarAbierto(false)}
              className="ml-auto p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Línea divisoria */}
          <div className="h-px bg-white/10 mx-4 mb-3" />

          {/* Menú principal de navegación */}
          <nav className="flex-1 overflow-y-auto px-3.5 space-y-1.5">

            {/* Opción Dashboard con píldora e indicador verde */}
            <button
              onClick={() => seleccionarOpcion('Dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${menuActivo === 'Dashboard'
                  ? 'bg-[#186438] text-white shadow-xs border border-white/15'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-white/90" />
                <span>Dashboard</span>
              </div>
              {menuActivo === 'Dashboard' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </button>

            {/* Módulos Principales con Chevron */}
            {modulosPrincipales.map((item) => {
              const Icon = item.icon;
              const activo = menuActivo === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${activo
                      ? 'bg-[#186438] text-white font-bold'
                      : 'text-white/85 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 shrink-0 text-white/80" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.tieneSubmenu && (
                    <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Pie de página del Sidebar (Footer) */}
          <div className="px-3.5 py-3 border-t border-white/10 shrink-0 space-y-1">
            {modulosFooter.map((item) => {
              const Icon = item.icon;
              const activo = menuActivo === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${activo
                      ? 'bg-[#186438] text-white font-bold'
                      : 'text-white/85 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-5 h-5 text-white/80 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-[#FECACAB8] hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Salir</span>
            </button>
          </div>

        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Cabecera Superior (Header) */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa en móvil */}
            <button
              onClick={() => setSidebarAbierto(true)}
              className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-none">{tituloActivo}</h2>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1">Inicio / {tituloActivo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Buscador visible desde pantallas grandes */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-9 pr-4 py-1.5 w-56 md:w-64 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Campana de Notificaciones */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Información del Usuario */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 md:pl-4 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {nombreUsuario.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-800">{nombreUsuario}</p>
                <p className="text-[10px] text-slate-400">{rolUsuario}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Contenedor con Scroll de las Vistas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {menuActivo === 'Dashboard' && (
            <div>
              <h1 className="text-xl md:text-2xl font-black text-emerald-800 tracking-tight">
                Bienvenido, {nombreUsuario.split(' ')[0]}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Resumen general del sistema
              </p>
            </div>
          )}

          {renderComponente()}
        </main>
      </div>

      {/* Botón flotante inferior de ayuda */}
      <button className="fixed bottom-4 right-4 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition text-sm z-30">
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}