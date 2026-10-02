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
  DollarSign,
  HelpCircle
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
  console.log("Objeto usuario recibido:", usuario);
  const [menuActivo, setMenuActivo] = useState('Dashboard');

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
  }


  const dashboardHome = () => (
    <div>
      <h1>Dashboard</h1>
      <p>esta es la pagina del dashboard.</p>
    </div>
  );

  const nombreUsuario = usuario?.nombre || 'Usuario';
  const rolUsuario = usuario?.rol || 'Rol';



  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden text-slate-800">
      
      {/* 1. BARRA LATERAL VERDE (SIDEBAR) */}
      <aside className="w-64 shrink-0 bg-[#15733e] text-white flex flex-col justify-between shadow-lg">
        <div>
          {/* Logo y Encabezado */}
          <div className="flex flex-col items-center justify-center pt-6 pb-5 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2 shadow-sm mb-2">
              <img src={Logo_sena} alt="Logo SENA" className="object-contain w-full h-full" />
            </div>
            <h1 className="text-xl font-black tracking-wider text-white">AGROSOFT</h1>
            <span className="text-[10px] tracking-[0.25em] text-white/70 uppercase">Sistema Agrícola</span>
          </div>

          {/* Opciones de Navegación */}
          <nav className="py-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const activo = menuActivo === item.id;
              return (
                <div key={item.id} className={item.separador ? 'mt-4' : ''}>
                  <button
                    onClick={() => setMenuActivo(item.id)}
                    className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-colors border-l-4 ${
                      activo
                        ? 'bg-[#186438] text-white font-bold border-[#00d664]'
                        : 'text-[#87bc9b] hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </div>
              );
            })}
            </nav>
            </div>

            {/* Opción Cerrar Sesión integrada al menú */}
            <div className="p-3 border-t border-white/10" >
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium text-[#e06b6b] hover:text-red-300 hover:bg-white/5 transition-colors border-l-4 border-transparent mt-1"
            >
              <LogOut className="w-5 h-5 shrink-0 rotate-180" />
              <span>Cerrar sesión</span>
            </button>
          </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* BARRA SUPERIOR (HEADER) */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-none">{tituloActivo}</h2>
          <p className="text-xs text-slate-400 mt-1">Inicio / {tituloActivo}</p>
        </div>

          <div className="flex items-center gap-5">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                {nombreUsuario.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-800">{nombreUsuario}</p>
                <p className="text-[10px] text-slate-400">{rolUsuario}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL (SCROLLABLE) */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Mensaje de Bienvenida */}
          <div>
            <h1 className="text-2xl font-black text-emerald-800 tracking-tight">
              Bienvenido, {nombreUsuario.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Resumen general del sistema · 10 de agosto de 2026
            </p>
          </div>

          {renderComponente()}

        </main>
      </div>

      {/* Botón flotante inferior derecho de ayuda */}
      <button className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition text-sm">
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}