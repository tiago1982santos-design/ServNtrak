import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useReminders } from "@/hooks/use-reminders";
import { useUnpaidExtraServices, useMarkServiceAsPaid } from "@/hooks/use-service-logs";
import { format, isToday, isTomorrow, startOfDay, isPast } from "date-fns";
import { Loader2, CalendarClock, MapPin, CheckCircle2, Bell, Map, Euro, AlertCircle, Banknote, BarChart3, CreditCard, Image, Wallet, Download } from "lucide-react";
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
  const upcomingAppointments = appointments?.filter(apt => !isToday(new Date(apt.date))) || [];
  
  const unpaidTotal = unpaidServices?.reduce((sum, s) => sum + (s.totalAmount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient mesh effect */}
      <div className="relative overflow-hidden bg-primary pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary-foreground/80 font-medium">Peralta Gardens,</p>
              <h1 className="text-3xl font-display font-bold text-white mt-1">Olá {userName}</h1>
            </div>
          </div>
          
          <WeatherWidget className="mt-4" showAlerts={true} />
          
          <div className="mt-4 flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Hoje</p>
              <p className="text-3xl font-bold text-white mt-1">{todayAppointments.length}</p>
              <p className="text-xs text-white/80">Trabalhos agendados</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Pendentes</p>
              <p className="text-3xl font-bold text-white mt-1">
                {appointments?.filter(a => !a.isCompleted).length || 0}
              </p>
              <p className="text-xs text-white/80">Total de tarefas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 relative z-20 space-y-8">
        
        {/* Today's Schedule */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-display text-foreground">Agenda de Hoje</h2>
            <Link href="/calendar" className="text-xs font-semibold text-primary">Ver Calendário</Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((apt) => (
                <Link key={apt.id} href={`/clients/${apt.clientId}`} className="block">
                  <div className="mobile-card flex items-start gap-4 hover:scale-[1.02] transition-transform">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      apt.type === "Garden" ? "bg-green-100 text-green-700" :
                      apt.type === "Pool" ? "bg-blue-100 text-blue-700" :
                      "bg-orange-100 text-orange-700"
                    )}>
                      {format(new Date(apt.date), "HH:mm")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{apt.client.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{apt.client.address || "Sem endereço"}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                          {apt.type === 'Garden' ? 'Jardim' : apt.type === 'Pool' ? 'Piscina' : apt.type}
                        </span>
                        {apt.isCompleted && (
                          <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Concluído
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-8 text-center border border-border/50 shadow-sm">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarClock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Sem trabalhos para hoje</p>
              <p className="text-sm text-muted-foreground mt-1">Aproveite o seu dia de folga!</p>
            </div>
          )}
        </section>

        {unpaidServices && unpaidServices.length > 0 && (
          <section>
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">Pagamentos Pendentes</h3>
                  <p className="text-white/90 text-xs mt-0.5">
                    {unpaidServices.length} serviço{unpaidServices.length > 1 ? 's' : ''} extra{unpaidServices.length > 1 ? 's' : ''} por cobrar
                  </p>
                  <p className="text-white font-bold text-lg mt-1">{unpaidTotal.toFixed(2)}€</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                {unpaidServices.slice(0, 3).map((service) => (
                  <div key={service.id} className="bg-white/10 rounded-xl p-2 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{service.clientName}</p>
                      <p className="text-white/70 text-[10px]">{format(new Date(service.date), "d/MM/yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">{(service.totalAmount || 0).toFixed(2)}€</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs"
                      onClick={() => markAsPaid.mutate(service.id)}
                      disabled={markAsPaid.isPending}
                      data-testid={`button-mark-paid-${service.id}`}
                    >
                      <Banknote className="w-3 h-3 mr-1" />
                      Cobrado
                    </Button>
                  </div>
                ))}
              </div>
              {unpaidServices.length > 3 && (
                <Link href="/billing" className="block text-center text-white/90 text-xs mt-2 underline">
                  Ver todos os {unpaidServices.length} pendentes
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold font-display text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-4 gap-3">
            <Link href="/map" className="flex flex-col items-center bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-3 rounded-2xl border border-green-100 dark:border-green-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-map">
              <div className="w-9 h-9 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <Map className="w-4 h-4 text-green-700 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-xs text-green-900 dark:text-green-300 text-center">Mapa</h3>
            </Link>
            
            <Link href="/reminders" className="flex flex-col items-center bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 p-3 rounded-2xl border border-amber-100 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-reminders">
              <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                <Bell className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-xs text-amber-900 dark:text-amber-300 text-center">Lembretes</h3>
            </Link>

            <Link href="/billing" className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-billing">
              <div className="w-9 h-9 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                <Euro className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-xs text-blue-900 dark:text-blue-300 text-center">Faturação</h3>
            </Link>

            <Link href="/reports" className="flex flex-col items-center bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 p-3 rounded-2xl border border-purple-100 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-reports">
              <div className="w-9 h-9 bg-purple-500/10 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-xs text-purple-900 dark:text-purple-300 text-center">Relatórios</h3>
            </Link>

            <Link href="/payments" className="flex flex-col items-center bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10 p-3 rounded-2xl border border-cyan-100 dark:border-cyan-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-payments">
              <div className="w-9 h-9 bg-cyan-500/10 rounded-full flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-xs text-cyan-900 dark:text-cyan-300 text-center">Pagamentos</h3>
            </Link>

            <Link href="/gallery" className="flex flex-col items-center bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 p-3 rounded-2xl border border-pink-100 dark:border-pink-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-gallery">
              <div className="w-9 h-9 bg-pink-500/10 rounded-full flex items-center justify-center mb-2">
                <Image className="w-4 h-4 text-pink-700 dark:text-pink-400" />
              </div>
              <h3 className="font-bold text-xs text-pink-900 dark:text-pink-300 text-center">Galeria</h3>
            </Link>

            <Link href="/finances" className="flex flex-col items-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-finances">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                <Wallet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 text-center">Finanças</h3>
            </Link>

            <Link href="/exports" className="flex flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/10 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/30 shadow-sm hover:shadow-md transition-all" data-testid="link-quick-exports">
              <div className="w-9 h-9 bg-slate-500/10 rounded-full flex items-center justify-center mb-2">
                <Download className="w-4 h-4 text-slate-700 dark:text-slate-400" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-300 text-center">Exportar</h3>
            </Link>
          </div>
        </section>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
        <QuickPhotoCaptureButton />
        <CreateClientDialog />
      </div>

      <BottomNav />
    </div>
  );
}
