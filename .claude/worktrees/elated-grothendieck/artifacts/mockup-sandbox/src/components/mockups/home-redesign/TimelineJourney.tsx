import React from "react";
import { 
  CloudSun, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Camera, 
  FileText, 
  Wallet,
  Home,
  Users,
  CalendarDays,
  Menu,
  User,
  AlertCircle,
  Navigation,
  Check
} from "lucide-react";

export function TimelineJourney() {
  const mockData = {
    userName: "Tiago",
    greeting: "Bom dia",
    weather: "22°C Parcialmente nublado",
    stats: "5 paragens hoje · 2 concluídas · 680€ pendentes",
    unpaidTotal: "450€",
    unpaidCount: 3,
    appointments: [
      {
        id: 1,
        time: "08:30",
        client: "Maria Silva",
        service: "Jardim",
        address: "Rua das Flores, 42, Lourinhã",
        status: "completed"
      },
      {
        id: 2,
        time: "10:00",
        client: "João Costa",
        service: "Piscina",
        address: "Av. 25 de Abril, 15, Peniche",
        status: "next"
      },
      {
        id: 3,
        time: "11:30",
        client: "Ana Rodrigues",
        service: "Jacuzzi",
        address: "Travessa do Sol, 8, Torres Vedras",
        status: "pending"
      },
      {
        id: 4,
        time: "14:00",
        client: "Carlos Mendes",
        service: "Jardim",
        address: "Rua do Mar, 23, Lourinhã",
        status: "pending"
      },
      {
        id: 5,
        time: "16:00",
        client: "Sofia Pereira",
        service: "Piscina + Jardim",
        address: "Largo da Praça, 5, Peniche",
        status: "pending"
      }
    ]
  };

  const getServiceColor = (service: string) => {
    if (service.includes("Jardim") && !service.includes("+")) return "bg-green-100 text-green-700 border-green-200";
    if (service.includes("Piscina") && !service.includes("+")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (service.includes("Jacuzzi")) return "bg-cyan-100 text-cyan-700 border-cyan-200";
    if (service.includes("+")) return "bg-teal-100 text-teal-700 border-teal-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 overflow-x-hidden w-full max-w-[390px] mx-auto relative border-x border-slate-200 shadow-sm flex flex-col">
      {/* Header Compact Strip */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">{mockData.greeting}, {mockData.userName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <CloudSun className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
          <span>{mockData.weather}</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-5">
        {/* Stats Strip */}
        <div className="bg-[#206F4C] text-white rounded-xl p-3 mb-8 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-green-200" strokeWidth={2.5} />
            <span className="text-[13px] font-medium tracking-wide">{mockData.stats}</span>
          </div>
        </div>

        {/* Timeline Journey */}
        <div className="relative pl-3">
          {/* Connector Line */}
          <div className="absolute top-4 bottom-8 left-[23.5px] w-0.5 bg-[#206F4C]/20 rounded-full"></div>

          <div className="space-y-6">
            {mockData.appointments.map((apt, index) => {
              const isCompleted = apt.status === "completed";
              const isNext = apt.status === "next";
              const isPending = apt.status === "pending";

              return (
                <div key={apt.id} className="relative flex gap-4 items-start group">
                  {/* Timeline Node */}
                  <div className="relative z-10 flex flex-col items-center mt-1">
                    {isCompleted && (
                      <div className="w-6 h-6 rounded-full bg-[#206F4C] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    )}
                    {isNext && (
                      <div className="w-6 h-6 rounded-full bg-white border-[3px] border-[#206F4C] flex items-center justify-center shadow-md ring-4 ring-[#206F4C]/10">
                        <div className="w-2 h-2 rounded-full bg-[#206F4C] animate-pulse"></div>
                      </div>
                    )}
                    {isPending && (
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      </div>
                    )}
                  </div>

                  {/* Appointment Card */}
                  <div className={`flex-1 rounded-2xl p-4 transition-all ${
                    isNext 
                      ? "bg-white border-2 border-[#206F4C] shadow-lg shadow-[#206F4C]/5 scale-[1.02]" 
                      : isCompleted
                        ? "bg-white/60 border border-slate-200"
                        : "bg-white border border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[15px] font-bold ${isCompleted ? 'text-slate-400' : isNext ? 'text-[#206F4C]' : 'text-slate-700'}`}>
                        {apt.time}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getServiceColor(apt.service)}`}>
                        {apt.service}
                      </span>
                    </div>
                    
                    <h3 className={`text-[17px] font-bold tracking-tight mb-1 ${isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                      {apt.client}
                    </h3>
                    
                    <div className={`flex items-start gap-1.5 text-[13px] mt-2 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="leading-tight font-medium">{apt.address}</span>
                    </div>

                    {isNext && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2.5">
                        <button className="flex-1 bg-[#206F4C] hover:bg-[#1a5a3d] text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          Iniciar Rota
                        </button>
                        <button className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold flex justify-center items-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Payments Alert */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="bg-amber-100 p-2 rounded-full mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-amber-900">Pagamentos Pendentes</h4>
            <p className="text-[13px] text-amber-700 mt-0.5 font-medium">Tem {mockData.unpaidTotal} ({mockData.unpaidCount} serviços) por cobrar.</p>
            <button className="mt-3 text-[12px] font-bold text-amber-700 bg-amber-200/50 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
              Cobrar Agora
            </button>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="mt-10 mb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Ações Rápidas</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-1">
            {[
              { icon: Plus, label: "Novo Serviço", bg: "bg-[#206F4C]/10", text: "text-[#206F4C]", border: "border-[#206F4C]/20" },
              { icon: Camera, label: "Foto Rápida", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
              { icon: FileText, label: "Orçamento", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
              { icon: Wallet, label: "Cobrar", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
            ].map((action, i) => (
              <button key={i} className="snap-start shrink-0 flex flex-col items-center gap-2.5 w-[76px] group">
                <div className={`w-14 h-14 rounded-2xl ${action.bg} border ${action.border} flex items-center justify-center transition-all group-active:scale-95 shadow-sm`}>
                  <action.icon className={`w-6 h-6 ${action.text}`} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center px-2 py-2">
          {[
            { icon: Home, label: "Início", active: true },
            { icon: Users, label: "Clientes" },
            { icon: CalendarDays, label: "Agenda" },
            { icon: Menu, label: "Mais" },
            { icon: User, label: "Perfil" },
          ].map((item, i) => (
            <button key={i} className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-colors ${item.active ? 'text-[#206F4C]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
              <item.icon className={`w-[22px] h-[22px] ${item.active ? 'fill-[#206F4C]/20 stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] ${item.active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe {
          padding-bottom: calc(12px + env(safe-area-inset-bottom));
        }
      `}} />
    </div>
  );
}
