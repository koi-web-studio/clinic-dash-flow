import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  Home, 
  Users, 
  Calendar, 
  LogOut, 
  X,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data para role - en implementación real vendría de context/auth
const mockUser = {
  role: "SECRETARY", // DOCTOR | SECRETARY | OWNER
  name: "María González"
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    ...(mockUser.role === "DOCTOR" ? [
      { path: "/my-patients", icon: Users, label: "Mis Pacientes" }
    ] : []),
    { path: "/patients", icon: Users, label: "Pacientes" },
    { path: "/appointments", icon: Calendar, label: "Agenda" },
    ...(mockUser.role === "OWNER" ? [
      { path: "/settings/users", icon: Settings, label: "Usuarios" }
    ] : [])
  ];

  const handleLogout = () => {
    // Mock logout - en implementación real manejaría auth
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar fijo superior */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-divider z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            {/* Hamburger menu - visible en móvil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link to="/" className="text-xl font-semibold text-foreground">
              CRM Turnos
            </Link>

            {/* Navigation links - ocultos en móvil */}
            <nav className="hidden md:flex items-center gap-6 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors ${
                    isActive(item.path)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {mockUser.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar deslizable */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-divider z-40 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4">
          {/* Botón cerrar en móvil */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <span className="font-medium">Navegación</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}