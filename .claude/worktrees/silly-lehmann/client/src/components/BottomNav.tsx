import { Link, useLocation } from "wouter";
import { Home, Calendar, Users, User, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const MORE_ROUTES = [
  "/purchases", "/finances", "/reports", "/exports", "/billing",
  "/payments", "/gallery", "/reminders", "/map", "/employees", "/pending-tasks",
  "/expense-notes",
];

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/",         icon: Home,       label: "Início"   },
    { href: "/clients",  icon: Users,      label: "Clientes" },
    { href: "/calendar", icon: Calendar,   label: "Agenda"   },
    { href: "/purchases",icon: LayoutGrid, label: "Mais"     },
    { href: "/profile",  icon: User,       label: "Perfil"   },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100/60 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(200,120,50,0.08)]"
      data-testid="bottom-navigation"
    >
      <div className="flex justify-around items-center mx-auto h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href === "/purchases" && MORE_ROUTES.includes(location));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full outline-none touch-manipulation"
              data-testid={`nav-${item.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
            >
              <div className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors",
                isActive ? "bg-orange-50" : "hover:bg-orange-50/40"
              )}>
                <item.icon
                  className={cn(
                    "w-5 h-5 mb-0.5 transition-colors",
                    isActive ? "text-amber-500" : "text-[#9B7B5E]"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] transition-colors",
                  isActive ? "font-bold text-amber-500" : "font-medium text-[#9B7B5E]"
                )}>
                  {item.label}
                </span>
              </div>
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
