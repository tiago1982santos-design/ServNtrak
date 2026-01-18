import { useState } from "react";
import { useAppointments } from "@/hooks/use-appointments";
import { BottomNav } from "@/components/BottomNav";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isSameDay } from "date-fns";
import { pt } from "date-fns/locale";
import { Loader2, MapPin, Clock, CheckCircle2, ChevronRight, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: appointments, isLoading } = useAppointments();

  const selectedDateAppointments = appointments?.filter(apt => 
    date && isSameDay(new Date(apt.date), date)
  ) || [];

  const daysWithAppointments = appointments?.map(a => new Date(a.date)) || [];

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Agenda</h1>
        <p className="text-white/70 text-sm mt-1">Gerir agendamentos e visitas</p>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        <div className="glass-card p-4 mb-6">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={pt}
            modifiers={{ hasAppointment: daysWithAppointments }}
            modifiersClassNames={{
              hasAppointment: 'has-appointment'
            }}
            className="mx-auto calendar-modern"
          />
        </div>
      </div>

      <style>{`
        .calendar-modern .rdp-day_selected {
          background: hsl(var(--primary)) !important;
          color: white !important;
          border-radius: 50% !important;
          font-weight: bold;
        }
        .calendar-modern .rdp-day_today {
          border: 2px solid hsl(var(--primary));
          border-radius: 50%;
        }
        .calendar-modern .has-appointment {
          font-weight: 700;
          color: hsl(var(--primary));
        }
        .calendar-modern .has-appointment::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: hsl(var(--primary));
          border-radius: 50%;
        }
        .calendar-modern .rdp-caption_label {
          font-weight: 700;
          color: hsl(var(--foreground));
          text-transform: capitalize;
        }
        .calendar-modern .rdp-head_cell {
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          font-weight: 500;
        }
        .calendar-modern .rdp-button:hover:not(.rdp-day_selected) {
          background: hsl(var(--muted));
          border-radius: 50%;
        }
        .calendar-modern .rdp-nav_button {
          color: hsl(var(--primary));
        }
      `}</style>

      <div className="px-5 space-y-4">
        <div className="section-header">
          <h2 className="section-title">
            {date ? format(date, "EEEE, d 'de' MMMM", { locale: pt }) : "Selecione uma data"}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : selectedDateAppointments.length > 0 ? (
          <div className="space-y-3">
            {selectedDateAppointments.map((apt, index) => (
              <Link key={apt.id} href={`/clients/${apt.clientId}`} data-testid={`link-calendar-appointment-${apt.id}`}>
                <div 
                  className="mobile-card flex items-center gap-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                    {apt.client.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{apt.client.address}</span>
                      </p>
                    )}
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
          </div>
        ) : (
          <div className="empty-state bg-card rounded-2xl border border-border/30">
            <div className="empty-state-icon bg-primary/5">
              <CalendarDays className="w-7 h-7 text-primary/60" />
            </div>
            <h3 className="font-semibold text-foreground">Sem agendamentos</h3>
            <p className="text-sm text-muted-foreground mt-1">Nenhuma visita marcada para este dia</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
