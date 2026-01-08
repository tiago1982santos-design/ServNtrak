import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { format, isToday, isTomorrow, startOfDay } from "date-fns";
import { Loader2, CalendarClock, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function Home() {
  const { user } = useAuth();
  
  // Stabilize the "from" date so it doesn't change on every render
  const todayStart = useMemo(() => startOfDay(new Date()).toISOString(), []);
  
  // Get upcoming appointments for dashboard
  const { data: appointments, isLoading } = useAppointments({ 
    from: todayStart 
  });

  const userName = user?.firstName || "Jardineiro";
  
  // Group appointments
  const todayAppointments = appointments?.filter(apt => isToday(new Date(apt.date))) || [];
  const upcomingAppointments = appointments?.filter(apt => !isToday(new Date(apt.date))) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient mesh effect */}
      <div className="relative overflow-hidden bg-primary pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        
        <div className="relative z-10">
          <p className="text-primary-foreground/80 font-medium">Peralta Gardens,</p>
          <h1 className="text-3xl font-display font-bold text-white mt-1">Olá {userName}</h1>
          
          <div className="mt-6 flex gap-4">
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
      <div className="px-6 -mt-6 relative z-20 space-y-8">
        
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

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold font-display text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/clients" className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="font-bold text-green-900">Mapa de Clientes</h3>
              <p className="text-xs text-green-700/70 mt-1">Ver rotas</p>
            </Link>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
               <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                <CalendarClock className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-900">Agenda</h3>
              <p className="text-xs text-blue-700/70 mt-1">Adicionar tarefa</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button for adding client */}
      <div className="fixed bottom-24 right-6 z-40">
        <CreateClientDialog />
      </div>

      <BottomNav />
    </div>
  );
}
