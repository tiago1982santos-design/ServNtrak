import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useUnpaidExtraServices, useMarkServiceAsPaid } from "@/hooks/use-service-logs";
import { format, isToday, startOfDay } from "date-fns";
import { 
  Loader2, CalendarClock, MapPin, CheckCircle2, Bell, Map, Euro, 
  AlertCircle, Banknote, BarChart3, CreditCard, Image, Wallet, 
  Download, ShoppingBag, Clock, ChevronRight, Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { QuickPhotoCaptureButton } from "@/components/QuickPhotoCaptureButton";
import { WeatherWidget } from "@/components/WeatherWidget";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useAuth();
  
  const todayStart = useMemo(() => startOfDay(new Date()).toISOString(), []);
  
  const { data: appointments, isLoading } = useAppointments({ 
    from: todayStart 
  });
  
  const { data: unpaidServices } = useUnpaidExtraServices();
  const markAsPaid = useMarkServiceAsPaid();

  const userName = user?.firstName || "Jardineiro";
  
  const todayAppointments = appointments?.filter(apt => isToday(new Date(apt.date))) || [];
  const pendingCount = appointments?.filter(a => !a.isCompleted).length || 0;
  
  const unpaidTotal = unpaidServices?.reduce((sum, s) => sum + (s.totalAmount || 0), 0) || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 19) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="relative overflow-hidden gradient-primary pt-14 pb-8 px-6">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="slide-up">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-white/70" />
                <p className="text-white/80 text-sm font-medium">Peralta Gardens</p>
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                {getGreeting()}, {userName}
              </h1>
            </div>
          </div>
          
          <div className="mt-5 fade-in" style={{ animationDelay: '0.1s' }}>
            <WeatherWidget className="mt-2" showAlerts={true} />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-20">
        <div className="grid grid-cols-2 gap-3 slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Hoje</span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{todayAppointments.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Trabalhos agendados</p>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Pendentes</span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total de tarefas</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-8">
        <section className="slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2 className="section-title">Agenda de Hoje</h2>
            <Link href="/calendar" className="section-link flex items-center gap-1" data-testid="link-view-calendar">
              Ver tudo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.slice(0, 4).map((apt, index) => (
                <Link key={apt.id} href={`/clients/${apt.clientId}`} className="block" data-testid={`link-appointment-${apt.id}`}>
                  <div 
                    className="mobile-card flex items-center gap-4"
                    style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold",
                      apt.type === "Garden" ? "bg-gradient-to-br from-green-100 to-green-50 text-green-700" :
                      apt.type === "Pool" ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700" :
                      apt.type === "Jacuzzi" ? "bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-700" :
                      "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700"
                    )}>
                      <span className="text-lg leading-none">{format(new Date(apt.date), "HH")}</span>
                      <span className="text-[10px] leading-none mt-0.5">{format(new Date(apt.date), "mm")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{apt.client.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{apt.client.address || "Sem endereço"}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          "badge-pill",
                          apt.type === "Garden" ? "bg-green-100 text-green-700" :
                          apt.type === "Pool" ? "bg-blue-100 text-blue-700" :
                          apt.type === "Jacuzzi" ? "bg-cyan-100 text-cyan-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {apt.type === 'Garden' ? 'Jardim' : apt.type === 'Pool' ? 'Piscina' : apt.type === 'Jacuzzi' ? 'Jacuzzi' : apt.type}
                        </span>
                        {apt.isCompleted && (
                          <span className="badge-pill bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" /> Feito
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                  </div>
                </Link>
              ))}
              {todayAppointments.length > 4 && (
                <Link href="/calendar" className="block text-center text-sm text-primary font-medium py-2" data-testid="link-view-more-appointments">
                  Ver mais {todayAppointments.length - 4} trabalhos
                </Link>
              )}
            </div>
          ) : (
            <div className="empty-state bg-card rounded-2xl border border-border/30">
              <div className="empty-state-icon bg-primary/5">
                <CalendarClock className="w-7 h-7 text-primary/60" />
              </div>
              <h3 className="font-semibold text-foreground">Sem trabalhos para hoje</h3>
              <p className="text-sm text-muted-foreground mt-1">Aproveite o seu dia!</p>
            </div>
          )}
        </section>

        {unpaidServices && unpaidServices.length > 0 && (
          <section className="slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden rounded-2xl p-5 gradient-warm shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">Pagamentos Pendentes</h3>
                    <p className="text-white/80 text-sm mt-0.5">
                      {unpaidServices.length} serviço{unpaidServices.length > 1 ? 's' : ''} extra{unpaidServices.length > 1 ? 's' : ''} por cobrar
                    </p>
                    <p className="text-2xl font-extrabold text-white mt-2">{unpaidTotal.toFixed(2)}€</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 max-h-36 overflow-y-auto">
                  {unpaidServices.slice(0, 3).map((service) => (
                    <div key={service.id} className="glass-card-dark p-3 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{service.clientName}</p>
                        <p className="text-white/60 text-xs">{format(new Date(service.date), "d/MM/yyyy")}</p>
                      </div>
                      <div className="text-right mr-2">
                        <p className="text-white font-bold">{(service.totalAmount || 0).toFixed(2)}€</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs font-semibold shadow-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          markAsPaid.mutate(service.id);
                        }}
                        disabled={markAsPaid.isPending}
                        data-testid={`button-mark-paid-${service.id}`}
                      >
                        <Banknote className="w-3.5 h-3.5 mr-1" />
                        Cobrado
                      </Button>
                    </div>
                  ))}
                </div>
                
                {unpaidServices.length > 3 && (
                  <Link href="/billing" className="block text-center text-white/90 text-sm mt-3 font-medium hover:text-white transition-colors" data-testid="link-view-all-pending">
                    Ver todos os {unpaidServices.length} pendentes →
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="slide-up" style={{ animationDelay: '0.35s' }}>
          <h2 className="section-title mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { href: "/map", icon: Map, label: "Mapa", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
              { href: "/reminders", icon: Bell, label: "Lembretes", color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", iconColor: "text-amber-600 dark:text-amber-400" },
              { href: "/billing", icon: Euro, label: "Faturação", color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", iconColor: "text-blue-600 dark:text-blue-400" },
              { href: "/reports", icon: BarChart3, label: "Relatórios", color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30", iconColor: "text-purple-600 dark:text-purple-400" },
              { href: "/payments", icon: CreditCard, label: "Pagamentos", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/30", iconColor: "text-cyan-600 dark:text-cyan-400" },
              { href: "/gallery", icon: Image, label: "Galeria", color: "from-pink-500 to-pink-600", bg: "bg-pink-50 dark:bg-pink-950/30", iconColor: "text-pink-600 dark:text-pink-400" },
              { href: "/finances", icon: Wallet, label: "Finanças", color: "from-teal-500 to-teal-600", bg: "bg-teal-50 dark:bg-teal-950/30", iconColor: "text-teal-600 dark:text-teal-400" },
              { href: "/exports", icon: Download, label: "Exportar", color: "from-slate-500 to-slate-600", bg: "bg-slate-50 dark:bg-slate-900/30", iconColor: "text-slate-600 dark:text-slate-400" },
            ].map((item, index) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  "quick-action border-transparent shadow-sm",
                  item.bg
                )}
                style={{ animationDelay: `${0.4 + index * 0.03}s` }}
                data-testid={`link-quick-${item.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
              >
                <div className={cn("icon-circle", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.iconColor)} />
                </div>
                <span className="text-[11px] font-semibold text-foreground mt-2 text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="slide-up pb-4" style={{ animationDelay: '0.45s' }}>
          <Link href="/purchases" className="block" data-testid="link-purchases">
            <div className="mobile-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Compras e Despesas</h3>
                <p className="text-sm text-muted-foreground">Gerir materiais e gastos</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
            </div>
          </Link>
        </section>
      </div>

      <div className="fixed bottom-24 right-5 z-40 flex flex-col gap-3">
        <QuickPhotoCaptureButton />
        <CreateClientDialog />
      </div>

      <BottomNav />
    </div>
  );
}
