import { Link, useLocation } from "wouter";
import { Home, Calendar, Users, User, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/clients", icon: Users, label: "Clientes" },
    { href: "/calendar", icon: Calendar, label: "Agenda" },
    { href: "/purchases", icon: LayoutGrid, label: "Mais" },
    { href: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="bottom-nav" data-testid="bottom-navigation">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || 
            (item.href === "/purchases" && ["/purchases", "/finances", "/reports", "/exports", "/billing", "/payments", "/gallery", "/reminders", "/map", "/employees"].includes(location));
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "bottom-nav-item flex-1 touch-manipulation",
                isActive && "active"
              )}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className={cn(
                "nav-icon",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "nav-label",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
