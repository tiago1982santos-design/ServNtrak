import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useUnpaidExtraServices } from "@/hooks/use-service-logs";
import { useWeather, getWeatherInfo } from "@/hooks/use-weather";
import { useGeofencing, type VisitaConcluida, type ClienteComLocalizacao } from "@/hooks/useGeofencing";
import { format, isToday, startOfDay, differenceInMinutes } from "date-fns";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, Moon, CloudMoon,
  AlertTriangle, ChevronRight, Play, MapPin, Navigation2,
  Droplets, Leaf, CheckCircle2, Map, FileText, Camera,
  BarChart2, Loader2, CalendarClock, ShoppingBag, Users, ClipboardList,
  Locate, LocateOff, Clock, X, Check, Pencil,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { QuickPhotoCaptureButton } from "@/components/QuickPhotoCaptureButton";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const SERVICE_CONFIG = {
  Garden:  { label: "Jardim",  Icon: Leaf,     badge: "bg-[#F0F4E8] text-[#6B7B3A]" },
  Pool:    { label: "Piscina", Icon: Droplets,  badge: "bg-[#E8F0EF] text-[#5B8B8B]" },
  Jacuzzi: { label: "Jacuzzi", Icon: Droplets,  badge: "bg-[#EBF1F0] text-[#6BA3A0]" },
  General: { label: "Geral",   Icon: ChevronRight, badge: "bg-[#F5EDE0] text-[#8B6B40]" },
};

function ServiceBadge({ type }: { type: string }) {
  const cfg = SERVICE_CONFIG[type as keyof typeof SERVICE_CONFIG] ?? SERVICE_CONFIG.General;
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit", cfg.badge)}>
      <cfg.Icon className="w-3.5 h-3.5" /> {cfg.label}
    </span>
  );
}

function WeatherPill() {
  const { data: weather, isLoading } = useWeather();

  if (isLoading || !weather) {
    return (
      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100/50">
        <Sun className="w-5 h-5 text-amber-300" />
        <span className="text-sm font-bold text-[#2D1B0E]/40">--°C</span>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);
  const iconKey = info.icon as string;

  const DayIcons: Record<string, typeof Sun> = { sun: Sun, cloud: Cloud, "cloud-sun": CloudSun, "cloud-rain": CloudRain, "cloud-drizzle": CloudDrizzle };
  const NightIcons: Record<string, typeof Moon> = { sun: Moon, "cloud-sun": CloudMoon, cloud: Cloud, "cloud-rain": CloudRain, "cloud-drizzle": CloudDrizzle };
  const WeatherIcon = weather.isDay ? (DayIcons[iconKey] ?? Sun) : (NightIcons[iconKey] ?? Moon);

  return (
    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100/50 shadow-[0_2px_10px_rgba(245,158,11,0.1)]">
      <WeatherIcon className="w-5 h-5 text-amber-500" />
      <span className="text-sm font-bold text-[#2D1B0E]">{Math.round(weather.temperature)}°C</span>
    </div>
  );
}

function CountdownBadge({ date }: { date: Date }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const minutes = differenceInMinutes(date, new Date());

  if (minutes <= 0) {
    return <span className="bg-white text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)]">A decorrer</span>;
  }
  if (minutes < 60) {
    return (
      <span className="bg-white text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center gap-1.5 animate-[pulse_3s_ease-in-out_infinite]">
        <Sun className="w-3.5 h-3.5 fill-orange-500" /> daqui a {minutes} min
      </span>
    );
  }
  return (
    <span className="bg-white text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center gap-1.5">
      <Sun className="w-3.5 h-3.5 fill-orange-500" /> em {Math.floor(minutes / 60)}h
    </span>
  );
}

function VisitaDuracaoAtiva({ inicio }: { inicio: Date }) {
  const [minutos, setMinutos] = useState(0);
  useEffect(() => {
    const calc = () => setMinutos(Math.max(0, Math.round((Date.now() - inicio.getTime()) / 60_000)));
    calc();
    const t = setInterval(calc, 30_000);
    return () => clearInterval(t);
  }, [inicio]);
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return <span className="tabular-nums font-bold">{h > 0 ? `${h}h ${m}min` : `${m} min`}</span>;
}

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [ajustarVisita, setAjustarVisita] = useState<VisitaConcluida | null>(null);
  const [ajustarMinutos, setAjustarMinutos] = useState("");

  const todayStart = useMemo(() => startOfDay(new Date()).toISOString(), []);
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(format(new Date(), "HH:mm")), 30_000);
    return () => clearInterval(t);
  }, []);

  const { data: appointments, isLoading } = useAppointments({ from: todayStart });
  const { data: unpaidServices } = useUnpaidExtraServices();

  const userName = user?.firstName || "Tiago";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 19) return "Boa tarde";
    return "Boa noite";
  };

  const todayAppointments = useMemo(
    () =>
      (appointments?.filter(apt => isToday(new Date(apt.date))) ?? []).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [appointments]
  );

  const completedToday = todayAppointments.filter(a => a.isCompleted);
  const nextAppointment = todayAppointments.find(a => !a.isCompleted);
  const unpaidTotal = unpaidServices?.reduce((s, x) => s + (x.totalAmount ?? 0), 0) ?? 0;
  const unpaidCount = unpaidServices?.length ?? 0;
  const progressFraction = todayAppointments.length > 0 ? completedToday.length / todayAppointments.length : 0;

  const clientesGeofencing: ClienteComLocalizacao[] = useMemo(() =>
    todayAppointments
      .filter(ag => !ag.isCompleted && ag.client?.latitude && ag.client?.longitude)
      .map(ag => ({
        id: ag.client.id,
        nome: ag.client.name,
        latitude: ag.client.latitude!,
        longitude: ag.client.longitude!,
        agendamentoId: ag.id,
      })),
    [todayAppointments]
  );

  const handleEntrada = useCallback(async (evento: { agendamentoId?: number; clienteId: number; timestamp: Date }) => {
    try {
      const res = await fetch("/api/geofencing/arrival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId: evento.clienteId,
          appointmentId: evento.agendamentoId,
          timestamp: evento.timestamp.toISOString(),
        }),
      });
      if (!res.ok) {
        console.error("Erro ao registar chegada:", await res.text());
      }
    } catch (err) {
      console.error("Erro ao registar chegada:", err);
    }
  }, []);

  const geo = useGeofencing(clientesGeofencing, {
    raioMetros: 75,
    intervaloMs: 30_000,
    onEntrada: handleEntrada,
  });

  const finalizarVisita = useCallback(async (visita: VisitaConcluida, duracaoOverride?: number) => {
    try {
      const res = await fetch("/api/geofencing/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId: visita.clienteId,
          appointmentId: visita.agendamentoId,
          inicio: visita.inicio.toISOString(),
          fim: visita.fim.toISOString(),
          duracaoMinutos: duracaoOverride ?? visita.duracaoMinutos,
          fonte: "geofencing",
        }),
      });
      if (!res.ok) {
        console.error("Erro ao guardar visita:", await res.text());
        return;
      }
      geo.confirmarVisita(visita);
      queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] });
    } catch (err) {
      console.error("Erro ao guardar visita:", err);
    }
  }, [geo, queryClient]);

  const ignorarVisita = useCallback(async (visita: VisitaConcluida) => {
    try {
      await fetch("/api/geofencing/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId: visita.clienteId,
          appointmentId: visita.agendamentoId,
        }),
      });
    } catch (err) {
      console.error("Erro ao descartar visita:", err);
    }
    geo.confirmarVisita(visita);
  }, [geo]);

  const quickActions = [
    { href: "/map",     Icon: Map,      label: "Mapa",      color: "bg-amber-50 text-amber-600 border-amber-200" },
    { href: "/billing", Icon: FileText, label: "Faturas",   color: "bg-[#F0F4E8] text-[#6B7B3A] border-[#DCE4C8]" },
    { href: "/gallery", Icon: Camera,   label: "Fotos",     color: "bg-orange-50 text-orange-500 border-orange-200" },
    { href: "/reports", Icon: BarChart2, label: "Relatórios", color: "bg-[#F5EDE0] text-[#8B6B40] border-[#E5D5C0]" },
  ];

  const moreActions = [
    { href: "/pending-tasks", Icon: ClipboardList, label: "Tarefas Pendentes", desc: "Ver todas as tarefas por fazer", iconBg: "bg-amber-100/70 text-amber-700" },
    { href: "/employees",    Icon: Users,          label: "Funcionários",       desc: "Gerir equipa e salários",         iconBg: "bg-orange-100/70 text-orange-700" },
    { href: "/purchases",    Icon: ShoppingBag,    label: "Compras e Despesas", desc: "Gerir materiais e gastos",        iconBg: "bg-[#F0F4E8] text-[#6B7B3A]" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5] pb-24 mx-auto max-w-[480px] relative">

      {/* ── HEADER ─────────────────────────────── */}
      <div className="bg-white px-5 pt-12 pb-5 rounded-b-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border-b border-orange-50/50 z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#9B7B5E] text-sm font-medium mb-0.5">{getGreeting()}, {userName}</p>
            <h1 className="text-3xl font-bold text-[#2D1B0E] tracking-tight" data-testid="text-current-time">{currentTime}</h1>
          </div>
          <WeatherPill />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-semibold text-[#9B7B5E] uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-bold text-[#6B7B3A]" data-testid="text-progress">
              {isLoading ? "…" : `${completedToday.length} de ${todayAppointments.length} concluído${completedToday.length !== 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="h-3 w-full bg-orange-50 rounded-full overflow-hidden shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-[#6B7B3A] to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progressFraction * 100}%` }}
            />
            {todayAppointments.length > 1 && todayAppointments.slice(1).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-[2px] bg-[#FFFCF5] pointer-events-none"
                style={{ left: `${((i + 1) / todayAppointments.length) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5">

        {/* ── GPS ERROR ALERT ────────────────────── */}
        {geo.erro && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3" data-testid="alert-gps-error">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Problema com GPS</p>
              <p className="text-xs text-amber-700 mt-0.5">{geo.erro}</p>
            </div>
            <button onClick={geo.parar} className="text-amber-600 hover:text-amber-800 p-1" data-testid="button-dismiss-gps-error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── VISIT CONFIRMATION CARDS ────────────── */}
        {geo.visitasPendentesConfirmacao.map(visita => (
          <div
            key={`${visita.clienteId}-${visita.inicio.getTime()}`}
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.08)] border border-[#DCE4C8] p-5 space-y-4"
            data-testid={`card-confirm-visit-${visita.clienteId}`}
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#F0F4E8] p-2.5 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-[#6B7B3A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6B7B3A] mb-1">Visita concluída</p>
                <h4 className="font-bold text-[#2D1B0E] text-lg truncate">{visita.clienteNome}</h4>
              </div>
            </div>
            <div className="bg-[#F9F7F3] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#2D1B0E]">
                <Clock className="w-4 h-4 text-[#9B7B5E]" />
                <span className="tabular-nums">
                  {visita.inicio.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  {" → "}
                  {visita.fim.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <span className="font-bold text-[#6B7B3A] text-sm tabular-nums">{visita.duracaoMinutos} min</span>
            </div>

            {ajustarVisita?.clienteId === visita.clienteId && ajustarVisita.inicio.getTime() === visita.inicio.getTime() ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="flex-1 border border-orange-200 rounded-xl px-3 py-2.5 text-sm text-[#2D1B0E] bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Duração real (min)"
                  value={ajustarMinutos}
                  onChange={e => setAjustarMinutos(e.target.value)}
                  autoFocus
                  data-testid="input-adjust-duration"
                />
                <button
                  className="bg-[#6B7B3A] text-white p-2.5 rounded-xl active:scale-95 transition-transform"
                  onClick={() => {
                    const mins = parseInt(ajustarMinutos);
                    if (mins > 0) finalizarVisita(visita, mins);
                    setAjustarVisita(null);
                    setAjustarMinutos("");
                  }}
                  data-testid="button-save-adjusted"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  className="bg-gray-100 text-gray-500 p-2.5 rounded-xl active:scale-95 transition-transform"
                  onClick={() => { setAjustarVisita(null); setAjustarMinutos(""); }}
                  data-testid="button-cancel-adjust"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-[#6B7B3A] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(107,123,58,0.2)]"
                  onClick={() => finalizarVisita(visita)}
                  data-testid="button-confirm-visit"
                >
                  <Check className="w-4 h-4" /> Confirmar
                </button>
                <button
                  className="bg-amber-50 text-amber-700 font-bold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 border border-amber-200 active:scale-[0.98] transition-transform"
                  onClick={() => { setAjustarVisita(visita); setAjustarMinutos(String(visita.duracaoMinutos)); }}
                  data-testid="button-adjust-visit"
                >
                  <Pencil className="w-3.5 h-3.5" /> Ajustar
                </button>
                <button
                  className="bg-gray-50 text-gray-500 font-bold py-3 px-4 rounded-full border border-gray-200 active:scale-[0.98] transition-transform"
                  onClick={() => ignorarVisita(visita)}
                  data-testid="button-ignore-visit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ── NEXT ACTION HERO ───────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest">A Seguir</h2>
          </div>

          {isLoading ? (
            <div className="bg-gradient-to-br from-[#F97316] to-[#EAB308] rounded-[2rem] p-5 flex items-center justify-center h-52">
              <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
            </div>
          ) : nextAppointment ? (
            <div
              className="bg-gradient-to-br from-[#F97316] to-[#EAB308] rounded-[2rem] p-5 shadow-[0_12px_35px_rgba(249,115,22,0.25)] text-white relative overflow-hidden"
              data-testid="card-next-appointment"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-orange-900/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-2 shadow-sm">
                    <span className="font-bold text-white text-sm tracking-wide">
                      {format(new Date(nextAppointment.date), "HH:mm")}
                    </span>
                  </div>
                  <CountdownBadge date={new Date(nextAppointment.date)} />
                </div>

                <div className="mb-4">
                  <h3 className="text-3xl font-bold mb-2 tracking-tight text-white drop-shadow-sm">
                    {nextAppointment.client.name}
                  </h3>
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/30 inline-flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
                    {nextAppointment.type === "Pool" || nextAppointment.type === "Jacuzzi"
                      ? <Droplets className="w-3.5 h-3.5" />
                      : <Leaf className="w-3.5 h-3.5" />}
                    {nextAppointment.type === "Garden" ? "Jardim" : nextAppointment.type === "Pool" ? "Piscina" : nextAppointment.type === "Jacuzzi" ? "Jacuzzi" : "Geral"}
                  </span>
                </div>

                {nextAppointment.client.address && (
                  <div className="flex items-center gap-3 mb-4 bg-orange-900/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="bg-white/20 p-2.5 rounded-full shadow-inner">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <p className="flex-1 font-bold text-white leading-tight">{nextAppointment.client.address}</p>
                    <button
                      className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors shadow-sm active:scale-95"
                      onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(nextAppointment.client.address!)}`, "_blank")}
                      data-testid="button-navigate-maps"
                    >
                      <Navigation2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}

                <Link href={`/clients/${nextAppointment.clientId}`}>
                  <button
                    className="w-full bg-white text-orange-600 font-bold text-lg py-4 rounded-full shadow-[0_8px_20px_rgba(200,100,0,0.2)] flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-[0.98] transition-all"
                    data-testid="button-start-service"
                  >
                    <Play className="w-5 h-5 fill-orange-600" />
                    Vamos a isso!
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#F0F4E8] to-[#E5EDD8] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(107,123,58,0.08)] border border-[#DCE4C8]" data-testid="card-no-appointments">
              <div className="w-16 h-16 bg-[#6B7B3A]/10 rounded-full flex items-center justify-center mb-4">
                <CalendarClock className="w-8 h-8 text-[#6B7B3A]" />
              </div>
              <h3 className="font-bold text-[#2D1B0E] text-lg">Todos os trabalhos feitos!</h3>
              <p className="text-[#9B7B5E] text-sm mt-1">Ótimo trabalho hoje 🌿</p>
              <Link href="/calendar">
                <button className="mt-4 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full" data-testid="button-schedule-appointment">
                  Agendar trabalho
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* ── ACTIVE VISIT CARD ──────────────────── */}
        {geo.visitaAtiva && (
          <div
            className="bg-gradient-to-br from-[#6B7B3A] to-[#8BA65A] rounded-[2rem] p-5 shadow-[0_12px_35px_rgba(107,123,58,0.25)] text-white relative overflow-hidden"
            data-testid="card-active-visit"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Em visita</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{geo.visitaAtiva.clienteNome}</h3>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Início: {geo.visitaAtiva.inicio.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <VisitaDuracaoAtiva inicio={geo.visitaAtiva.inicio} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── URGENCY STRIP ──────────────────────── */}
        {unpaidCount > 0 && (
          <Link href="/billing" data-testid="link-unpaid-strip">
            <button className="w-full bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-[1.5rem] p-4 flex items-center justify-between text-amber-800 transition-colors shadow-[0_4px_15px_rgba(251,191,36,0.15)]">
              <div className="flex items-center gap-3">
                <div className="bg-white/60 p-2 rounded-full text-amber-700 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-base" data-testid="text-unpaid-total">{unpaidTotal.toFixed(2)}€ por cobrar</span>
                  <span className="text-xs text-amber-800/80 font-medium">
                    {unpaidCount} serviço{unpaidCount !== 1 ? "s" : ""} pendente{unpaidCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-800/60" />
            </button>
          </Link>
        )}

        {/* ── QUICK ACTIONS + TRACKING ────────────── */}
        <section>
          <div className="flex justify-between items-center px-2">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} data-testid={`link-quick-${action.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                <button className="flex flex-col items-center gap-2.5 group outline-none">
                  <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-[0_4px_12px_rgba(200,120,50,0.06)] border group-active:scale-95 transition-transform", action.color)}>
                    <action.Icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-[#9B7B5E]">{action.label}</span>
                </button>
              </Link>
            ))}
          </div>

          {/* ── GPS TRACKING BUTTON ────────────────── */}
          <div className="mt-4">
            <button
              onClick={geo.ativo ? geo.parar : geo.iniciar}
              className={cn(
                "w-full py-3.5 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(200,120,50,0.08)]",
                geo.ativo
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]"
                  : "bg-white border border-orange-100 text-[#9B7B5E] hover:bg-orange-50/30"
              )}
              data-testid="button-toggle-tracking"
            >
              {geo.ativo ? (
                <>
                  <LocateOff className="w-4 h-4" />
                  Pausar tracking
                  {geo.posicaoAtual && (
                    <span className="ml-1 text-xs opacity-80">
                      ({geo.ultimoUpdate ? format(geo.ultimoUpdate, "HH:mm") : "…"})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Locate className="w-4 h-4" />
                  Iniciar tracking
                </>
              )}
            </button>
          </div>
        </section>

        {/* ── QUEUE ──────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest">Fila de Espera</h2>
            <Link href="/calendar" className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full" data-testid="link-calendar">
              Ver Agenda
            </Link>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border border-orange-50 p-10 flex justify-center">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border border-orange-50 overflow-hidden">
              {todayAppointments.map((apt, i) => (
                <Link key={apt.id} href={`/clients/${apt.clientId}`} data-testid={`link-appointment-${apt.id}`}>
                  <div className={cn(
                    "flex items-center gap-4 p-4 hover:bg-orange-50/30 active:bg-orange-50/50 transition-colors",
                    i < todayAppointments.length - 1 && "border-b border-orange-50/50",
                    apt.isCompleted && "opacity-70"
                  )}>
                    <div className="flex-shrink-0 w-12 flex justify-center">
                      {apt.isCompleted ? (
                        <div className="bg-[#F0F4E8] p-1.5 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-[#6B7B3A]" />
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg tabular-nums whitespace-nowrap">
                          {format(new Date(apt.date), "HH:mm")}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={cn("font-bold text-[#2D1B0E] truncate", apt.isCompleted && "line-through text-[#9B7B5E]")}>
                          {apt.client.name}
                        </span>
                        {apt.client.address && (
                          <span className="text-xs font-medium text-[#9B7B5E] ml-2 shrink-0 max-w-[90px] truncate">
                            {apt.client.address.split(",").pop()?.trim()}
                          </span>
                        )}
                      </div>
                      <ServiceBadge type={apt.type} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9B7B5E]/40 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border border-orange-50 p-8 flex flex-col items-center text-center">
              <CalendarClock className="w-10 h-10 text-amber-200 mb-3" />
              <p className="font-semibold text-[#2D1B0E]">Sem trabalhos para hoje</p>
              <p className="text-sm text-[#9B7B5E] mt-1">Aproveite o seu dia!</p>
            </div>
          )}
        </section>

        {/* ── MORE ACTIONS ───────────────────────── */}
        <section className="pb-4 space-y-3">
          <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest px-2 mb-4">Mais</h2>
          {moreActions.map((action) => (
            <Link key={action.href} href={action.href} className="block" data-testid={`link-more-${action.href.slice(1)}`}>
              <div className="bg-white rounded-[1.5rem] shadow-[0_4px_15px_rgba(200,120,50,0.05)] border border-orange-50 p-4 flex items-center gap-4 hover:bg-orange-50/20 active:scale-[0.99] transition-all">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", action.iconBg)}>
                  <action.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#2D1B0E]">{action.label}</h3>
                  <p className="text-sm text-[#9B7B5E]">{action.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9B7B5E]/40 shrink-0" />
              </div>
            </Link>
          ))}
        </section>

      </div>

      {/* FABs */}
      <div className="fixed bottom-24 right-5 z-40 flex flex-col gap-3">
        <QuickPhotoCaptureButton />
        <CreateClientDialog />
      </div>

      <BottomNav />
    </div>
  );
}
