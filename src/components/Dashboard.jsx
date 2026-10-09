import { useState } from 'react';
import {
  LayoutDashboard,
  Sprout,
  ClipboardList,
  AlertTriangle,
  FlaskConical,
  Wheat,
  CalendarDays,
  Radio,
  Package,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import Logo_sena from '../assets/Logo_sena.png';
import UnidadesProductivas from '../pages/UnidadesProductivas.jsx';
import Actividades from '../pages/Actividades.jsx';
import Incidencias from '../pages/Incidencias.jsx';
import Tratamientos from '../pages/Tratamientos.jsx';
import Cosechas from '../pages/Cosechas.jsx';
import Calendario from '../pages/Calendario.jsx';
import Sensores from '../pages/Sensores.jsx';
import Inventario from '../pages/Inventario.jsx';
import Perfil from '../pages/Perfil.jsx';
import Configuracion from '../pages/Configuracion.jsx';

export default function Dashboard({ usuario, onLogout }) {
  const [menuActivo, setMenuActivo] = useState('Dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Menú lateral principal
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Unidades', label: 'Unidades Productivas', icon: Sprout },
    { id: 'Actividades', label: 'Actividades', icon: ClipboardList },
    { id: 'Incidencias', label: 'Incidencias', icon: AlertTriangle },
    { id: 'Tratamientos', label: 'Tratamientos', icon: FlaskConical },
    { id: 'Cosechas', label: 'Cosechas', icon: Wheat },
    { id: 'Calendario', label: 'Calendario / Tareas', icon: CalendarDays },
    { id: 'Sensores', label: 'Sensores IoT', icon: Radio },
    { id: 'Inventario', label: 'Inventario', icon: Package },
    { id: 'Perfil', label: 'Mi Perfil', icon: User },
    { id: 'Configuracion', label: 'Configuración', icon: Settings },
  ];

  const itemActivo = menuItems.find((item) => item.id === menuActivo);
  const tituloActivo = itemActivo ? itemActivo.label : 'Dashboard';

  const renderComponente = () => {
    switch (menuActivo) {
      case 'Unidades': return <UnidadesProductivas />;
      case 'Actividades': return <Actividades />;
      case 'Incidencias': return <Incidencias />;
      case 'Tratamientos': return <Tratamientos />;
      case 'Cosechas': return <Cosechas />;
      case 'Calendario': return <Calendario />;
      case 'Sensores': return <Sensores />;
      case 'Inventario': return <Inventario />;
      case 'Perfil': return <Perfil />;
      case 'Configuracion': return <Configuracion />;
      default: return dashboardHome();
    }
  };

  const dashboardHome = () => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Panel Principal</h3>
      <p className="text-sm text-slate-500 mt-1">Bienvenido a la vista general de AgroSoft.</p>
    </div>
  );

  const nombreUsuario = usuario?.nombre || 'Usuario';
  const rolUsuario = usuario?.rol || 'Rol';

  // Cambiar pestaña y cerrar sidebar en móvil
  const seleccionarOpcion = (id) => {
    setMenuActivo(id);
    setSidebarAbierto(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-800 relative">
      
      {/* OVERLAY PARA MÓVILES (Fondo oscuro al abrir el sidebar) */}
      {sidebarAbierto && (
        <div 
          onClick={() => setSidebarAbierto(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 1. BARRA LATERAL (SIDEBAR RESPONSIVO) */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#15733e] text-white flex flex-col justify-between shadow-2xl md:shadow-lg transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo y Encabezado con botón de cerrar en móvil */}
          <div className="relative flex flex-col items-center justify-center pt-6 pb-5 border-b border-white/10 shrink-0">
            <button
              onClick={() => setSidebarAbierto(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center p-2 shadow-sm mb-2">
              <img src={Logo_sena} alt="Logo SENA" className="object-contain w-full h-full" />
            </div>
            <h1 className="text-xl font-black tracking-wider text-white">AGROSOFT</h1>
            <span className="text-[10px] tracking-[0.25em] text-white/70 uppercase">Sistema Agrícola</span>
          </div>

          {/* Opciones de Navegación con scroll independiente */}
          <nav className="py-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const activo = menuActivo === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-colors border-l-4 ${
                    activo
                      ? 'bg-[#186438] text-white font-bold border-[#00d664]'
                      : 'text-[#87bc9b] hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Opción Cerrar Sesión integrada al pie */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium text-[#e06b6b] hover:text-red-300 hover:bg-white/5 transition-colors border-l-4 border-transparent"
            >
              <LogOut className="w-5 h-5 shrink-0 rotate-180" />
              <span>Cerrar sesión</span>
            </button>
          </div>

        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* BARRA SUPERIOR (HEADER) */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa (Solo móvil) */}
            <button
              onClick={() => setSidebarAbierto(true)}
              className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition"
              aria-label="Abrir menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-none">{tituloActivo}</h2>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1">Inicio / {tituloActivo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Buscador (oculto en móvil para no saturar) */}
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

            {/* Perfil del Usuario */}
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

        {/* CONTENIDO PRINCIPAL (SCROLLABLE) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          
          {/* Mensaje de Bienvenida (Solo visible cuando se está en el menú Dashboard) */}
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

      {/* Botón flotante inferior derecho de ayuda */}
      <button className="fixed bottom-4 right-4 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition text-sm z-30">
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}