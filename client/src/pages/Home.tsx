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
  AlertTriangle, MapPin, Navigation2,
  Droplets, Leaf, CheckCircle2, Camera,
  FileText, BarChart2, Loader2, CalendarClock, ShoppingBag, Users, ClipboardList,
  Locate, LocateOff, Clock, X, Check, Pencil,
  Plus, Wallet, Navigation, AlertCircle, Map,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { QuickPhotoCaptureButton } from "@/components/QuickPhotoCaptureButton";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const SERVICE_COLORS: Record<string, string> = {
  Garden:  "bg-green-100 text-green-700 border-green-200",
  Pool:    "bg-blue-100 text-blue-700 border-blue-200",
  Jacuzzi: "bg-cyan-100 text-cyan-700 border-cyan-200",
  General: "bg-amber-100 text-amber-700 border-amber-200",
};

const SERVICE_LABELS: Record<string, string> = {
  Garden:  "Jardim",
  Pool:    "Piscina",
  Jacuzzi: "Jacuzzi",
  General: "Geral",
};

function getServiceBadgeClass(type: string) {
  return SERVICE_COLORS[type] ?? SERVICE_COLORS.General;
}

function getServiceLabel(type: string) {
  return SERVICE_LABELS[type] ?? type;
}

function WeatherStrip() {
  const { data: weather, isLoading } = useWeather();

  if (isLoading || !weather) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Sun className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
        <span>--°C</span>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);
  const iconKey = info.icon as string;
  const DayIcons: Record<string, typeof Sun> = { sun: Sun, cloud: Cloud, "cloud-sun": CloudSun, "cloud-rain": CloudRain, "cloud-drizzle": CloudDrizzle };
  const NightIcons: Record<string, typeof Moon> = { sun: Moon, "cloud-sun": CloudMoon, cloud: Cloud, "cloud-rain": CloudRain, "cloud-drizzle": CloudDrizzle };
  const WeatherIcon = weather.isDay ? (DayIcons[iconKey] ?? Sun) : (NightIcons[iconKey] ?? Moon);

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      <WeatherIcon className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
      <span>{Math.round(weather.temperature)}°C {info.label}</span>
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
  if (minutes <= 0) return <span className="text-[11px] font-bold text-[#206F4C] bg-[#206F4C]/10 px-2 py-0.5 rounded-full">A decorrer</span>;
  if (minutes < 60) return <span className="text-[11px] font-bold text-[#206F4C] bg-[#206F4C]/10 px-2 py-0.5 rounded-full animate-pulse">em {minutes} min</span>;
  return <span className="text-[11px] font-bold text-[#206F4C] bg-[#206F4C]/10 px-2 py-0.5 rounded-full">em {Math.floor(minutes / 60)}h</span>;
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

  const { data: appointments, isLoading } = useAppointments({ from: todayStart });
  const { data: unpaidServices } = useUnpaidExtraServices();

  const userName = user?.firstName || "Utilizador";

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

  const clientesGeofencing: ClienteComLocalizacao[] = useMemo(
    () =>
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
      await fetch("/api/geofencing/arrival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId: evento.clienteId,
          appointmentId: evento.agendamentoId,
          timestamp: evento.timestamp.toISOString(),
        }),
      });
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
      if (!res.ok) return;
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
        body: JSON.stringify({ clientId: visita.clienteId, appointmentId: visita.agendamentoId }),
      });
    } catch (err) {
      console.error("Erro ao descartar visita:", err);
    }
    geo.confirmarVisita(visita);
  }, [geo]);

  const getAptStatus = (apt: typeof todayAppointments[number]) => {
    if (apt.isCompleted) return "completed";
    if (apt.id === nextAppointment?.id) return "next";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 overflow-x-hidden w-full max-w-[480px] mx-auto relative">

      {/* ── HEADER ─────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <span className="text-[15px] font-bold text-slate-900 tracking-tight" data-testid="text-greeting">
          {getGreeting()}, {userName}
        </span>
        <WeatherStrip />
      </header>

      <main className="flex-1 px-4 py-5">

        {/* ── GPS ERROR ──────────────────────────── */}
        {geo.erro && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-4" data-testid="alert-gps-error">
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
            className="bg-white rounded-2xl shadow-md border border-[#206F4C]/20 p-5 space-y-4 mb-4"
            data-testid={`card-confirm-visit-${visita.clienteId}`}
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#206F4C]/10 p-2.5 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-[#206F4C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#206F4C] mb-1">Visita concluída</p>
                <h4 className="font-bold text-slate-900 text-lg truncate">{visita.clienteNome}</h4>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">
                  {visita.inicio.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  {" → "}
                  {visita.fim.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <span className="font-bold text-[#206F4C] text-sm tabular-nums">{visita.duracaoMinutos} min</span>
            </div>

            {ajustarVisita?.clienteId === visita.clienteId && ajustarVisita.inicio.getTime() === visita.inicio.getTime() ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#206F4C]/30"
                  placeholder="Duração real (min)"
                  value={ajustarMinutos}
                  onChange={e => setAjustarMinutos(e.target.value)}
                  autoFocus
                  data-testid="input-adjust-duration"
                />
                <button
                  className="bg-[#206F4C] text-white p-2.5 rounded-xl active:scale-95 transition-transform"
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
                  className="bg-slate-100 text-slate-500 p-2.5 rounded-xl active:scale-95 transition-transform"
                  onClick={() => { setAjustarVisita(null); setAjustarMinutos(""); }}
                  data-testid="button-cancel-adjust"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-[#206F4C] hover:bg-[#1a5a3d] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md"
                  onClick={() => finalizarVisita(visita)}
                  data-testid="button-confirm-visit"
                >
                  <Check className="w-4 h-4" /> Confirmar
                </button>
                <button
                  className="bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 active:scale-[0.98] transition-transform"
                  onClick={() => { setAjustarVisita(visita); setAjustarMinutos(String(visita.duracaoMinutos)); }}
                  data-testid="button-adjust-visit"
                >
                  <Pencil className="w-3.5 h-3.5" /> Ajustar
                </button>
                <button
                  className="bg-slate-50 text-slate-500 font-bold py-3 px-4 rounded-xl border border-slate-200 active:scale-[0.98] transition-transform"
                  onClick={() => ignorarVisita(visita)}
                  data-testid="button-ignore-visit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ── ACTIVE VISIT CARD ──────────────────── */}
        {geo.visitaAtiva && (
          <div
            className="bg-[#206F4C] rounded-2xl p-5 shadow-lg text-white relative overflow-hidden mb-4"
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

        {/* ── STATS STRIP ───────────────────────── */}
        <div className="bg-[#206F4C] text-white rounded-xl p-3 mb-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-green-200" strokeWidth={2.5} />
            {isLoading ? (
              <span className="text-[13px] font-medium tracking-wide opacity-70">A carregar…</span>
            ) : (
              <span className="text-[13px] font-medium tracking-wide" data-testid="text-today-stats">
                {todayAppointments.length} paragem{todayAppointments.length !== 1 ? "s" : ""} hoje
                {" · "}{completedToday.length} concluída{completedToday.length !== 1 ? "s" : ""}
                {unpaidTotal > 0 && ` · ${unpaidTotal.toFixed(0)}€ pendentes`}
              </span>
            )}
          </div>
        </div>

        {/* ── TIMELINE ──────────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 text-[#206F4C] animate-spin" />
          </div>
        ) : todayAppointments.length > 0 ? (
          <div className="relative pl-3 mb-6">
            {/* Connector line */}
            <div className="absolute top-4 bottom-8 left-[23.5px] w-0.5 bg-[#206F4C]/20 rounded-full" />

            <div className="space-y-5">
              {todayAppointments.map((apt) => {
                const status = getAptStatus(apt);
                const isCompleted = status === "completed";
                const isNext = status === "next";
                const isPending = status === "pending";
                const aptDate = new Date(apt.date);

                return (
                  <div key={apt.id} className="relative flex gap-4 items-start group" data-testid={`card-appointment-${apt.id}`}>
                    {/* Timeline Node */}
                    <div className="relative z-10 flex flex-col items-center mt-1 shrink-0">
                      {isCompleted && (
                        <div className="w-6 h-6 rounded-full bg-[#206F4C] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                      )}
                      {isNext && (
                        <div className="w-6 h-6 rounded-full bg-white border-[3px] border-[#206F4C] flex items-center justify-center shadow-md ring-4 ring-[#206F4C]/10">
                          <div className="w-2 h-2 rounded-full bg-[#206F4C] animate-pulse" />
                        </div>
                      )}
                      {isPending && (
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Appointment Card */}
                    <Link href={`/clients/${apt.clientId}`} className="flex-1 min-w-0">
                      <div className={cn(
                        "rounded-2xl p-4 transition-all",
                        isNext
                          ? "bg-white border-2 border-[#206F4C] shadow-lg shadow-[#206F4C]/5 scale-[1.02]"
                          : isCompleted
                            ? "bg-white/60 border border-slate-200"
                            : "bg-white border border-slate-200 shadow-sm"
                      )}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[15px] font-bold",
                              isCompleted ? "text-slate-400" : isNext ? "text-[#206F4C]" : "text-slate-700"
                            )}>
                              {format(aptDate, "HH:mm")}
                            </span>
                            {isNext && <CountdownBadge date={aptDate} />}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                            getServiceBadgeClass(apt.type)
                          )}>
                            {getServiceLabel(apt.type)}
                          </span>
                        </div>

                        <h3 className={cn(
                          "text-[17px] font-bold tracking-tight mb-1",
                          isCompleted ? "text-slate-500 line-through decoration-slate-300" : "text-slate-900"
                        )}>
                          {apt.client.name}
                        </h3>

                        {apt.client.address && (
                          <div className={cn(
                            "flex items-start gap-1.5 text-[13px] mt-2",
                            isCompleted ? "text-slate-400" : "text-slate-500"
                          )}>
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="leading-tight font-medium">{apt.client.address}</span>
                          </div>
                        )}

                        {isNext && apt.client.address && (
                          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2.5">
                            <button
                              className="flex-1 bg-[#206F4C] hover:bg-[#1a5a3d] text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
                              onClick={e => {
                                e.preventDefault();
                                window.open(`https://maps.google.com/maps?q=${encodeURIComponent(apt.client.address!)}`, "_blank");
                              }}
                              data-testid="button-navigate-maps"
                            >
                              <Navigation className="w-4 h-4" />
                              Iniciar Rota
                            </button>
                            <Link
                              href={`/clients/${apt.clientId}`}
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold flex justify-center items-center"
                                data-testid="button-view-client"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center mb-6 shadow-sm" data-testid="card-no-appointments">
            <div className="w-14 h-14 bg-[#206F4C]/10 rounded-full flex items-center justify-center mb-4">
              <CalendarClock className="w-7 h-7 text-[#206F4C]" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Sem trabalhos para hoje</h3>
            <p className="text-slate-500 text-sm mt-1">Aproveite o seu dia!</p>
            <Link href="/calendar">
              <button className="mt-4 text-sm font-bold text-[#206F4C] bg-[#206F4C]/10 border border-[#206F4C]/20 px-4 py-2 rounded-full" data-testid="button-schedule-appointment">
                Agendar trabalho
              </button>
            </Link>
          </div>
        )}

        {/* ── PENDING PAYMENTS ──────────────────── */}
        {unpaidCount > 0 && (
          <Link href="/billing" data-testid="link-unpaid-strip">
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="bg-amber-100 p-2 rounded-full mt-0.5 shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-amber-900">Pagamentos Pendentes</h4>
                <p className="text-[13px] text-amber-700 mt-0.5 font-medium" data-testid="text-unpaid-total">
                  Tem {unpaidTotal.toFixed(2)}€ ({unpaidCount} serviço{unpaidCount !== 1 ? "s" : ""}) por cobrar.
                </p>
                <span className="mt-3 inline-block text-[12px] font-bold text-amber-700 bg-amber-200/50 px-3 py-1.5 rounded-lg">
                  Cobrar Agora
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* ── QUICK ACTIONS ─────────────────────── */}
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Ações Rápidas</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar px-1">
            {[
              { href: "/calendar", Icon: Plus, label: "Novo Serviço", bg: "bg-[#206F4C]/10", text: "text-[#206F4C]", border: "border-[#206F4C]/20" },
              { href: "/gallery",  Icon: Camera, label: "Foto Rápida", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
              { href: "/billing",  Icon: FileText, label: "Faturas", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
              { href: "/payments", Icon: Wallet, label: "Cobrar", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
              { href: "/map",      Icon: Map, label: "Mapa", bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-200" },
              { href: "/reports",  Icon: BarChart2, label: "Relatórios", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="snap-start shrink-0" data-testid={`link-quick-${action.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`}>
                <div className="flex flex-col items-center gap-2.5 w-[76px] group">
                  <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center transition-all group-active:scale-95 shadow-sm", action.bg, action.border)}>
                    <action.Icon className={cn("w-6 h-6", action.text)} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── MORE ACTIONS ─────────────────────── */}
        <div className="space-y-3 mb-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Mais</h3>
          {[
            { href: "/pending-tasks", Icon: ClipboardList, label: "Tarefas Pendentes", desc: "Ver todas as tarefas por fazer", iconBg: "bg-amber-100/70 text-amber-700" },
            { href: "/employees",    Icon: Users,          label: "Funcionários",       desc: "Gerir equipa e salários",         iconBg: "bg-orange-100/70 text-orange-700" },
            { href: "/purchases",    Icon: ShoppingBag,    label: "Compras e Despesas", desc: "Gerir materiais e gastos",        iconBg: "bg-green-100/70 text-green-700" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="block" data-testid={`link-more-${action.href.slice(1)}`}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:bg-slate-50 active:scale-[0.99] transition-all">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", action.iconBg)}>
                  <action.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{action.label}</h3>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── GPS TRACKING ─────────────────────── */}
        <button
          onClick={geo.ativo ? geo.parar : geo.iniciar}
          className={cn(
            "w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] border",
            geo.ativo
              ? "bg-[#206F4C] border-[#206F4C] text-white shadow-md"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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

      </main>

      {/* FABs */}
      <div className="fixed bottom-24 right-5 z-40 flex flex-col gap-3">
        <QuickPhotoCaptureButton />
        <CreateClientDialog />
      </div>

      <BottomNav />

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
