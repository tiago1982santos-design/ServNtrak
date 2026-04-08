import React from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Play, 
  AlertTriangle,
  Map,
  FileText,
  Camera,
  BarChart2,
  Home,
  Users,
  Calendar,
  MoreHorizontal,
  User,
  Navigation2,
  ChevronRight,
  Sun,
  Droplets,
  Leaf
} from 'lucide-react';

export function QliqloqDark() {
  return (
    <div className="min-h-screen bg-[#0D0C22] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden text-[#F0EFF8]">
      
      {/* Top Header & Progress */}
      <div className="px-5 pt-8 pb-4 z-10 relative bg-[#0D0C22]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#F0EFF8] tracking-tight leading-none mb-1">09:45</h1>
            <p className="text-[#7B7A9D] text-sm">Bom dia, Tiago</p>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1838] px-3 py-2 rounded-2xl border border-white/[0.06] shadow-sm">
            <Sun className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
            <span className="text-sm font-semibold text-[#F0EFF8]">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-semibold text-[#7B7A9D] uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-semibold text-[#00E8A2]">1 / 5 concluídos</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-[#00E8A2] w-1/5 rounded-full shadow-[0_0_10px_rgba(0,232,162,0.5)]"></div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-6">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00E8A2] animate-pulse"></div>
            <h2 className="text-xs font-bold text-[#7B7A9D] uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-[#1A1838] rounded-3xl p-5 border border-white/[0.06] relative overflow-hidden" 
               style={{ borderLeft: '4px solid #00E8A2', boxShadow: 'inset 4px 0 20px rgba(0,232,162,0.1)' }}>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#00E8A2]/10 px-3 py-1.5 rounded-xl border border-[#00E8A2]/20 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00E8A2]" />
                  <span className="font-bold text-[#00E8A2] text-sm tracking-wide">10:00</span>
                </div>
                <div className="text-[#FBBF24] px-2 py-1.5 rounded-xl font-bold text-sm animate-pulse">
                  daqui a 15 min
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-3xl font-extrabold mb-2 text-[#F0EFF8] tracking-tight">João Costa</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-[#38BDF8]/12 text-[#38BDF8] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6 bg-white/[0.05] p-3.5 rounded-2xl">
                <div className="bg-white/10 p-2 rounded-xl mt-0.5">
                  <MapPin className="w-4 h-4 text-[#F0EFF8]" />
                </div>
                <div>
                  <p className="font-semibold text-[#F0EFF8] leading-tight">Av. 25 de Abril, 15</p>
                  <p className="text-[#7B7A9D] text-sm mt-0.5">Peniche</p>
                </div>
                <button className="ml-auto bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors self-center border border-white/[0.05]">
                  <Navigation2 className="w-5 h-5 text-[#F0EFF8]" />
                </button>
              </div>

              <button className="w-full bg-[#00E8A2] text-[#0D0C22] font-extrabold text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,232,162,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                <Play className="w-5 h-5 fill-[#0D0C22]" />
                INICIAR SERVIÇO
              </button>
            </div>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-2xl p-4 flex items-center justify-between transition-colors shadow-sm active:scale-[0.98]">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#FBBF24]/20 p-2 rounded-xl text-[#FBBF24]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-[#F0EFF8] text-sm">450€ por cobrar</span>
              <span className="text-xs text-[#FBBF24] font-medium mt-0.5">3 serviços pendentes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#FBBF24]/70" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center px-1">
            {[
              { icon: Map, label: 'Mapa', color: 'text-[#00E8A2]', bg: 'bg-[#1A1838]' },
              { icon: FileText, label: 'Faturação', color: 'text-[#7C6FCD]', bg: 'bg-[#1A1838]' },
              { icon: Camera, label: 'Fotos', color: 'text-[#38BDF8]', bg: 'bg-[#1A1838]' },
              { icon: BarChart2, label: 'Relatórios', color: 'text-[#FBBF24]', bg: 'bg-[#1A1838]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2.5 group outline-none">
                <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center ${action.bg} ${action.color} border border-white/[0.06] shadow-sm group-active:scale-95 transition-transform`}>
                  <action.icon className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-medium text-[#7B7A9D]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING STACK */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-bold text-[#7B7A9D] uppercase tracking-widest">Fila de Espera</h2>
          </div>
          
          <div className="bg-[#1A1838] rounded-3xl border border-white/[0.06] overflow-hidden">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] opacity-50">
              <div className="flex flex-col items-center justify-center w-12">
                <CheckCircle2 className="w-6 h-6 text-[#7B7A9D]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#7B7A9D] line-through">Maria Silva</span>
                  <span className="text-xs font-mono text-[#7B7A9D] line-through">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#7B7A9D] flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] active:bg-white/[0.02] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-mono text-[#7B7A9D]">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#F0EFF8]">Ana Rodrigues</span>
                  <span className="text-xs text-[#7B7A9D]">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#A78BFA]/12 text-[#A78BFA] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] active:bg-white/[0.02] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-mono text-[#7B7A9D]">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#F0EFF8]">Carlos Mendes</span>
                  <span className="text-xs text-[#7B7A9D]">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#00E8A2]/12 text-[#00E8A2] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 active:bg-white/[0.02] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-mono text-[#7B7A9D]">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#F0EFF8]">Sofia Pereira</span>
                  <span className="text-xs text-[#7B7A9D]">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#38BDF8]/12 text-[#38BDF8] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                  <span className="text-white/20 text-xs">+</span>
                  <span className="bg-[#00E8A2]/12 text-[#00E8A2] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-[#0D0C22] border-t border-white/[0.08] pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#00E8A2]">
            <Home className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Início</span>
            <div className="w-1 h-1 rounded-full bg-[#00E8A2] absolute bottom-1.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#7B7A9D] hover:text-[#F0EFF8] transition-colors">
            <Users className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#7B7A9D] hover:text-[#F0EFF8] transition-colors">
            <Calendar className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#7B7A9D] hover:text-[#F0EFF8] transition-colors">
            <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#7B7A9D] hover:text-[#F0EFF8] transition-colors">
            <User className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
