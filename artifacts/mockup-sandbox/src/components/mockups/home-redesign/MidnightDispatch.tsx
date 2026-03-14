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

export function MidnightDispatch() {
  return (
    <div className="min-h-screen bg-[#0F1117] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden text-[#F0F0F0]">
      
      {/* Top Header & Progress */}
      <div className="bg-[#1A1D28] px-5 pt-8 pb-4 border-b border-[#2A2E3D] z-10 relative">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-[#7A8BA8] text-sm font-medium tracking-wide uppercase">Bom dia, Tiago</p>
            <h1 className="text-2xl font-bold text-[#F0F0F0] tracking-tight tabular-nums">09:45</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#0F1117] px-3 py-1.5 rounded-lg border border-[#2A2E3D]">
            <Sun className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
            <span className="text-sm font-bold text-[#F0F0F0] tabular-nums">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-[#7A8BA8] uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-bold text-[#00D68F]">1 / 5 CONCLUÍDOS</span>
          </div>
          <div className="h-1.5 w-full bg-[#0F1117] rounded-none overflow-hidden flex border border-[#2A2E3D]">
            <div className="h-full bg-[#00D68F] w-1/5 shadow-[0_0_8px_rgba(0,214,143,0.5)]"></div>
            <div className="h-full w-4/5 flex">
               <div className="w-1/4 border-l border-[#2A2E3D] h-full"></div>
               <div className="w-1/4 border-l border-[#2A2E3D] h-full"></div>
               <div className="w-1/4 border-l border-[#2A2E3D] h-full"></div>
               <div className="w-1/4 border-l border-[#2A2E3D] h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 rounded-none bg-[#00D68F] shadow-[0_0_8px_rgba(0,214,143,0.8)] animate-pulse"></div>
            <h2 className="text-sm font-bold text-[#7A8BA8] uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0F3460] rounded-xl p-5 border border-[#00D68F]/50 shadow-[0_0_15px_rgba(0,214,143,0.15)] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#3B82F6]/10 blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#0F1117]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2A2E3D] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                  <span className="font-bold text-[#F0F0F0] text-sm tracking-wide tabular-nums">10:00</span>
                </div>
                <div className="bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/50 px-3 py-1.5 rounded-lg font-bold text-sm shadow-[0_0_10px_rgba(251,191,36,0.3)] animate-pulse uppercase tracking-wider">
                  daqui a 15 min
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-3xl font-extrabold mb-1 tracking-tight text-[#F0F0F0]">João Costa</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-blue-900/40 text-[#60A5FA] px-2.5 py-1 rounded-md text-xs font-bold border border-blue-800/50 flex items-center gap-1.5 uppercase tracking-wider">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6 bg-[#0F1117]/60 p-3 rounded-xl border border-[#2A2E3D]">
                <div className="bg-[#1A1D28] p-2 rounded-lg mt-0.5 border border-[#2A2E3D]">
                  <MapPin className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-bold text-[#F0F0F0] leading-tight">Av. 25 de Abril, 15</p>
                  <p className="text-[#7A8BA8] text-sm font-medium uppercase tracking-wider mt-0.5">Peniche</p>
                </div>
                <button className="ml-auto bg-[#3B82F6]/10 p-2 rounded-lg border border-[#3B82F6]/30 hover:bg-[#3B82F6]/20 transition-colors self-center">
                  <Navigation2 className="w-5 h-5 text-[#3B82F6]" />
                </button>
              </div>

              <button className="w-full bg-[#00D68F] text-[#0F1117] font-extrabold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(0,214,143,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#00E69A]">
                <Play className="w-5 h-5 fill-[#0F1117]" />
                INICIAR SERVIÇO
              </button>
            </div>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-[#1A1D28] hover:bg-[#202432] border border-[#FBBF24]/40 rounded-xl p-3 flex items-center justify-between transition-colors shadow-[0_0_10px_rgba(251,191,36,0.05)]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FBBF24]/10 p-1.5 rounded-lg border border-[#FBBF24]/30 text-[#FBBF24]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm text-[#F0F0F0]">450€ POR COBRAR</span>
              <span className="text-xs text-[#FBBF24] font-bold tracking-wide mt-0.5">3 SERVIÇOS PENDENTES</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#FBBF24]/70" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center px-2">
            {[
              { icon: Map, label: 'MAPA', color: 'text-[#3B82F6]', shadow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]', border: 'border-[#3B82F6]/30' },
              { icon: FileText, label: 'FATURAS', color: 'text-[#00D68F]', shadow: 'hover:shadow-[0_0_15px_rgba(0,214,143,0.3)]', border: 'border-[#00D68F]/30' },
              { icon: Camera, label: 'FOTOS', color: 'text-[#A855F7]', shadow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]', border: 'border-[#A855F7]/30' },
              { icon: BarChart2, label: 'DADOS', color: 'text-[#FBBF24]', shadow: 'hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]', border: 'border-[#FBBF24]/30' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 group outline-none">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-[#1A1D28] border ${action.border} ${action.shadow} group-active:scale-95 transition-all`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold text-[#7A8BA8] uppercase tracking-wider">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING STACK */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-[#7A8BA8] uppercase tracking-widest">Fila de Espera</h2>
            <button className="text-xs font-bold text-[#3B82F6] hover:text-[#60A5FA] uppercase tracking-wider">Ver Mapa</button>
          </div>
          
          <div className="bg-[#1A1D28] rounded-xl border border-[#2A2E3D] overflow-hidden">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-[#2A2E3D] bg-[#0F1117]/50 opacity-50">
              <div className="flex flex-col items-center justify-center w-12">
                <CheckCircle2 className="w-6 h-6 text-[#00D68F]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#7A8BA8] line-through">Maria Silva</span>
                  <span className="text-xs font-bold text-[#7A8BA8] tabular-nums line-through">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#7A8BA8] flex items-center gap-1 uppercase tracking-wider">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#2A2E3D] hover:bg-[#202432] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#F0F0F0] tabular-nums tracking-wide">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#F0F0F0]">Ana Rodrigues</span>
                  <span className="text-xs font-bold text-[#7A8BA8] uppercase tracking-wider">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-950/50 text-[#22D3EE] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-cyan-800/50 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#2A2E3D] hover:bg-[#202432] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#F0F0F0] tabular-nums tracking-wide">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#F0F0F0]">Carlos Mendes</span>
                  <span className="text-xs font-bold text-[#7A8BA8] uppercase tracking-wider">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-950/50 text-[#4ADE80] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-green-800/50 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 hover:bg-[#202432] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#F0F0F0] tabular-nums tracking-wide">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#F0F0F0]">Sofia Pereira</span>
                  <span className="text-xs font-bold text-[#7A8BA8] uppercase tracking-wider">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-950/50 text-[#60A5FA] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-800/50 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                  <span className="text-[#2A2E3D] text-xs font-bold">+</span>
                  <span className="bg-green-950/50 text-[#4ADE80] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-green-800/50 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-[#0A0C10] border-t border-[#2A2E3D] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#00D68F]">
            <Home className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#7A8BA8] hover:text-[#F0F0F0] transition-colors">
            <Users className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#7A8BA8] hover:text-[#F0F0F0] transition-colors">
            <Calendar className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#7A8BA8] hover:text-[#F0F0F0] transition-colors">
            <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#7A8BA8] hover:text-[#F0F0F0] transition-colors">
            <User className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
