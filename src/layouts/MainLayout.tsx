import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutGrid, 
  Target, 
  Clock, 
  FileText, 
  Stethoscope, 
  History, 
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexto/useAuth';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Metas', path: '/goals', icon: Target },
    { label: 'Tempo', path: '/screenTime', icon: Clock },
    { label: 'Relatórios', path: '/reports', icon: FileText },
    { label: 'Diagnóstico', path: '/diagnostic', icon: Stethoscope },
    { label: 'Histórico', path: '/history', icon: History, hideMobile: true },
    { label: 'Ajustes', path: '/settings', icon: Settings, hideMobile: true },
  ];

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <div className="flex h-screen bg-bg-main text-text-main overflow-hidden antialiased">
      
      {/* 💻 Sidebar Lateral (Oculta no Mobile) */}
      <aside className="hidden md:flex w-64 bg-bg-card/60 border-r border-white/5 flex-col justify-between backdrop-blur-md">
        <div>
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="bg-brand-alert/10 text-brand-alert p-2 rounded-xl border border-brand-alert/20 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Focus<span className="text-brand-alert">Flow</span>
            </span>
          </div>

          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-alert/15 text-brand-alert font-semibold border border-brand-alert/30'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-alert' : 'text-text-muted'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-brand-alert/20 text-brand-alert border border-brand-alert/30 flex items-center justify-center font-bold text-sm shrink-0">
                {userInitial.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName || 'Usuário'}
                </p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-brand-alert hover:bg-brand-alert/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 🚀 Área de Conteúdo */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Superior (Adaptado para Mobile) */}
        <header className="h-16 bg-bg-main/90 border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-3 md:hidden">
            <div className="bg-brand-alert/10 text-brand-alert p-1.5 rounded-lg border border-brand-alert/20">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">FocusFlow</span>
          </div>
          
          <h2 className="hidden md:block text-sm font-medium text-text-muted">
            Plataforma de Diagnóstico Digital
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-bg-card transition-colors relative">
              <Bell className="w-5 h-5 md:w-4 md:h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-alert rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scroll do Conteúdo */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 📱 Bottom Navigation (Apenas no Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-bg-card/90 border-t border-white/5 backdrop-blur-md z-50 px-2 py-2 flex items-center justify-around">
        {menuItems.filter(item => !item.hideMobile).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all ${
                isActive ? 'text-brand-alert' : 'text-text-muted'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-brand-alert/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};