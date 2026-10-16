import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  ShieldAlert,
  Radio,
  Box,
  ShoppingCart,
  Users,
  BookOpen,
  ChartColumn,
  ChevronRight,
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

export default function Dashboard({ usuario, onLogout, onUsuarioActualizado }) {
  const [menuActivo, setMenuActivo] = useState('Dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const menuUsuarioRef = useRef(null);
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  // Menú lateral principal: los ítems con "hijos" son grupos desplegables
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'g-territorio', label: 'Territorio y Cultivos', icon: Map,
      hijos: [
        { id: 'Unidades', label: 'Unidades Productivas' },
        { id: 'Cosechas', label: 'Cosechas' },
      ],
    },
    {
      id: 'g-actividades', label: 'Actividades de Campo', icon: ClipboardList,
      hijos: [
        { id: 'Actividades', label: 'Actividades' },
        { id: 'Calendario', label: 'Calendario / Tareas' },
      ],
    },
    {
      id: 'g-fitosanitario', label: 'Control Fitosanitario', icon: ShieldAlert,
      hijos: [
        { id: 'Incidencias', label: 'Incidencias' },
        { id: 'Tratamientos', label: 'Tratamientos' },
      ],
    },
    {
      id: 'g-sensores', label: 'Sensores IoT', icon: Radio,
      hijos: [
        { id: 'Sensores', label: 'Monitoreo en Tiempo Real' },
        { id: 'Alertas', label: 'Alertas' },
      ],
    },
    {
      id: 'g-inventario', label: 'Inventario e Insumos', icon: Box,
      hijos: [{ id: 'Inventario', label: 'Inventario' }],
    },
    {
      id: 'g-comercial', label: 'Comercial y Ventas', icon: ShoppingCart,
      hijos: [{ id: 'Ventas', label: 'Ventas' }],
    },
    {
      id: 'g-usuarios', label: 'Usuarios y Seguridad', icon: Users,
      hijos: [{ id: 'Usuarios', label: 'Usuarios' }],
    },
    { id: 'Wiki', label: 'Wiki Agronómica', icon: BookOpen },
    { id: 'Reportes', label: 'Reportes', icon: ChartColumn },
  ];

  // Accesos fijos al pie del sidebar
  const menuPie = [
    { id: 'Configuracion', label: 'Configuración', icon: Settings },
    { id: 'Perfil', label: 'Mi Perfil', icon: User },
  ];

  const hojas = [...menuItems.flatMap((item) => item.hijos || [item]), ...menuPie];
  const tituloActivo = hojas.find((item) => item.id === menuActivo)?.label || 'Dashboard';

  // Acordeón: solo un grupo abierto a la vez
  const alternarGrupo = (id) => setGrupoAbierto((actual) => (actual === id ? null : id));

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
      case 'Perfil': return <Perfil usuario={usuario} onUsuarioActualizado={onUsuarioActualizado} />;
      case 'Configuracion': return <Configuracion />;
      case 'Alertas':
      case 'Ventas':
      case 'Usuarios':
      case 'Wiki':
      case 'Reportes': return proximamente();
      default: return dashboardHome();
    }
  };

  const proximamente = () => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{tituloActivo}</h3>
      <p className="text-sm text-slate-500 mt-1">Este módulo estará disponible próximamente.</p>
    </div>
  );

  const dashboardHome = () => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Panel Principal</h3>
      <p className="text-sm text-slate-500 mt-1">Bienvenido a la vista general de AgroSoft.</p>
    </div>
  );

  const nombreUsuario = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ') || 'Usuario';
  // Iniciales: primera letra del nombre y del apellido (ej: "María Paula Navas" -> "MN")
  const inicialesUsuario = (
    usuario?.apellido
      ? `${usuario.nombre?.[0] ?? ''}${usuario.apellido[0]}`
      : nombreUsuario.substring(0, 2)
  ).toUpperCase();
  const rolUsuario = usuario?.rol || 'Rol';

  // Cierra el menú del usuario al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!menuUsuarioAbierto) return;
    const alClickFuera = (e) => {
      if (menuUsuarioRef.current && !menuUsuarioRef.current.contains(e.target)) {
        setMenuUsuarioAbierto(false);
      }
    };
    const alTeclear = (e) => e.key === 'Escape' && setMenuUsuarioAbierto(false);
    document.addEventListener('mousedown', alClickFuera);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('mousedown', alClickFuera);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [menuUsuarioAbierto]);

  const irDesdeMenuUsuario = (id) => {
    setMenuUsuarioAbierto(false);
    setMenuActivo(id);
  };

  // Cambiar pestaña y cerrar sidebar en móvil
  const seleccionarOpcion = (id) => {
    setMenuActivo(id);
    // Abre el grupo de la opción elegida y cierra los demás
    setGrupoAbierto(menuItems.find((item) => item.hijos?.some((h) => h.id === id))?.id ?? null);
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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-[#1b7a42] to-[#0f5a2d] text-white flex flex-col justify-between shadow-2xl md:shadow-lg transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo y Encabezado con botón de cerrar en móvil */}
          <div className="relative flex items-center gap-3 px-5 pt-6 pb-5 shrink-0">
            <button
              onClick={() => setSidebarAbierto(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
              <img src={Logo_sena} alt="Logo SENA" className="object-contain w-full h-full" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-black tracking-wide text-white">AGROSOFT</h1>
              <span className="text-[10px] tracking-[0.18em] text-white/60 uppercase">Sistema Agrícola</span>
            </div>
          </div>

          {/* Opciones de Navegación con scroll independiente */}
          <nav className="px-3 py-2 flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (!item.hijos) {
                const activo = menuActivo === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => seleccionarOpcion(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-colors border ${
                      activo
                        ? 'bg-[#2a8c52] border-white/15 text-white font-bold shadow-sm'
                        : 'border-transparent text-white/80 font-medium hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {activo && <span className="w-2 h-2 rounded-full bg-[#4ade80]" />}
                  </button>
                );
              }

              const abierto = grupoAbierto === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => alternarGrupo(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 text-white/50 transition-transform ${abierto ? 'rotate-90' : ''}`} />
                  </button>
                  {abierto && (
                    <div className="mt-0.5 mb-1 space-y-0.5">
                      {item.hijos.map((hijo) => {
                        const activo = menuActivo === hijo.id;
                        return (
                          <button
                            key={hijo.id}
                            onClick={() => seleccionarOpcion(hijo.id)}
                            className={`w-full flex items-center gap-3 pl-4.5 pr-4 py-1.5 text-[13px] rounded-lg transition-colors ${
                              activo
                                ? 'bg-[#2a8c52] text-white font-bold'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${activo ? 'bg-[#4ade80]' : 'bg-white/40'}`} />
                            {hijo.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Accesos fijos al pie */}
          <div className="px-3 py-3 border-t border-white/10 shrink-0 space-y-0.5">
            {menuPie.map((item) => {
              const Icon = item.icon;
              const activo = menuActivo === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-colors ${
                    activo ? 'bg-[#2a8c52] text-white font-bold' : 'text-white/80 font-medium hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setConfirmarSalida(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Salir</span>
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
            <div className="relative" ref={menuUsuarioRef}>
              <button
                type="button"
                onClick={() => setMenuUsuarioAbierto((abierto) => !abierto)}
                aria-haspopup="menu"
                aria-expanded={menuUsuarioAbierto}
                className="flex items-center gap-2.5 cursor-pointer rounded-lg hover:bg-slate-50 transition px-1.5 py-1"
              >
                {usuario?.fotoPerfil ? (
                  <img
                    src={usuario.fotoPerfil}
                    alt={`Foto de ${nombreUsuario}`}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#15733e] text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {inicialesUsuario}
                  </div>
                )}
                <div className="text-left leading-tight hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">{nombreUsuario}</p>
                  <p className="text-xs text-slate-400">{rolUsuario}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${menuUsuarioAbierto ? 'rotate-180' : ''}`}
                />
              </button>

              {menuUsuarioAbierto && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{nombreUsuario}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{usuario?.correo}</p>
                  </div>

                  <div className="py-1.5">
                    <button
                      role="menuitem"
                      onClick={() => irDesdeMenuUsuario('Perfil')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Mi perfil
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => irDesdeMenuUsuario('Configuracion')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Configuración
                    </button>
                  </div>

                  <div className="py-1.5 border-t border-slate-100">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuUsuarioAbierto(false);
                        setConfirmarSalida(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
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

      {/* Modal de confirmación para cerrar sesión */}
      {confirmarSalida && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setConfirmarSalida(false)}
          onKeyDown={(e) => e.key === 'Escape' && setConfirmarSalida(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cerrar-sesion"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 pt-10 pb-8 text-center"
          >
            <div className="mx-auto w-18 h-18 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut className="w-7 h-7 text-red-600" />
            </div>
            <h2 id="titulo-cerrar-sesion" className="mt-5 text-xl font-extrabold text-slate-900">
              ¿Cerrar sesión?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                autoFocus
                onClick={() => setConfirmarSalida(false)}
                className="py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setConfirmarSalida(false);
                  onLogout();
                }}
                className="py-3 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante inferior derecho de ayuda */}
      <button className="fixed bottom-4 right-4 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition text-sm z-30">
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
}