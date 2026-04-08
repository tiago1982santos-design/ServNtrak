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

export function SunnyPolished() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden shadow-[0_20px_40px_rgba(200,120,50,0.08)]">
      
      {/* Top Header & Progress */}
      <div className="bg-white px-5 pt-8 pb-5 rounded-b-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border-b border-orange-50/50 z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#9B7B5E] text-sm font-medium mb-0.5">Bom dia, Tiago</p>
            <h1 className="text-3xl font-bold text-[#2D1B0E] tracking-tight">09:45</h1>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100/50 shadow-[0_2px_10px_rgba(245,158,11,0.1)]">
            <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-[#2D1B0E]">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-semibold text-[#9B7B5E] uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-bold text-[#6B7B3A]">1 de 5 concluídos</span>
          </div>
          <div className="h-3 w-full bg-orange-50 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#6B7B3A] to-amber-400 w-1/5 rounded-full"></div>
            <div className="h-full w-4/5 flex">
               <div className="w-1/4 border-l-2 border-[#FFFCF5] h-full"></div>
               <div className="w-1/4 border-l-2 border-[#FFFCF5] h-full"></div>
               <div className="w-1/4 border-l-2 border-[#FFFCF5] h-full"></div>
               <div className="w-1/4 border-l-2 border-[#FFFCF5] h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#F97316] to-[#EAB308] rounded-[2rem] p-5 shadow-[0_12px_35px_rgba(249,115,22,0.25)] text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-orange-900/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-2 shadow-sm">
                  <Clock className="w-4 h-4 text-orange-50" />
                  <span className="font-bold text-white text-sm tracking-wide">10:00</span>
                </div>
                <div className="bg-white text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center gap-1.5 animate-[pulse_3s_ease-in-out_infinite]">
                  <Sun className="w-3.5 h-3.5 fill-orange-500" />
                  daqui a 15 min
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 tracking-tight text-white drop-shadow-sm">João Costa</h3>
                <div className="flex items-center gap-2 font-medium">
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
                    <Droplets className="w-3.5 h-3.5" /> Piscina
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 bg-orange-900/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div className="bg-white/20 p-2.5 rounded-full shadow-inner">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white leading-tight">Av. 25 de Abril, 15</p>
                  <p className="text-orange-100 text-sm font-medium">Peniche</p>
                </div>
                <button className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors shadow-sm active:scale-95">
                  <Navigation2 className="w-5 h-5 text-white" />
                </button>
              </div>

              <button className="w-full bg-white text-orange-600 font-bold text-lg py-4 rounded-full shadow-[0_8px_20px_rgba(200,100,0,0.2)] flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-[0.98] transition-all">
                <Play className="w-5 h-5 fill-orange-600" />
                Vamos a isso!
              </button>
            </div>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-[1.5rem] p-4 flex items-center justify-between text-amber-800 transition-colors shadow-[0_4px_15px_rgba(251,191,36,0.15)]">
          <div className="flex items-center gap-3">
            <div className="bg-white/60 p-2 rounded-full text-amber-700 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-base">450€ por cobrar</span>
              <span className="text-xs text-amber-800/80 font-medium">3 serviços pendentes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-800/60" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center px-2">
            {[
              { icon: Map, label: 'Mapa', color: 'bg-amber-50 text-amber-600 border-amber-200' },
              { icon: FileText, label: 'Faturas', color: 'bg-[#F0F4E8] text-[#6B7B3A] border-[#DCE4C8]' },
              { icon: Camera, label: 'Fotos', color: 'bg-orange-50 text-orange-500 border-orange-200' },
              { icon: BarChart2, label: 'Relatórios', color: 'bg-[#F5EDE0] text-[#8B6B40] border-[#E5D5C0]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2.5 group outline-none">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${action.color} shadow-[0_4px_12px_rgba(200,120,50,0.06)] border border-white/50 group-active:scale-95 transition-transform bg-gradient-to-br from-white/40 to-transparent`}>
                  <action.icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-[#9B7B5E]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING STACK */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest">Fila de Espera</h2>
            <button className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">Ver Mapa</button>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,120,50,0.06)] border border-orange-50 overflow-hidden">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-orange-50/50 bg-gradient-to-r from-[#F0F4E8]/50 to-transparent opacity-80">
              <div className="flex flex-col items-center justify-center w-12">
                <div className="bg-[#F0F4E8] p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#6B7B3A]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#9B7B5E] line-through">Maria Silva</span>
                  <span className="text-xs font-medium text-[#9B7B5E] line-through">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#6B7B3A]/80 flex items-center gap-1 bg-[#F0F4E8] px-2 py-0.5 rounded-full">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-orange-50/50 hover:bg-orange-50/30 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#2D1B0E]">Ana Rodrigues</span>
                  <span className="text-xs font-medium text-[#9B7B5E]">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#EBF1F0] text-[#6BA3A0] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-orange-50/50 hover:bg-orange-50/30 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#2D1B0E]">Carlos Mendes</span>
                  <span className="text-xs font-medium text-[#9B7B5E]">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#F0F4E8] text-[#6B7B3A] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 hover:bg-orange-50/30 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-[#2D1B0E]">Sofia Pereira</span>
                  <span className="text-xs font-medium text-[#9B7B5E]">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#E8F0EF] text-[#5B8B8B] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Piscina
                  </span>
                  <span className="text-[#9B7B5E]/30 text-xs font-bold">+</span>
                  <span className="bg-[#F0F4E8] text-[#6B7B3A] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-orange-100/50 pb-safe z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(200,120,50,0.08)]">
        <div className="flex justify-around items-center h-16 px-2">
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-amber-500 transition-colors">
            <Home className="w-5 h-5 mb-0.5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Início</span>
            <div className="w-1 h-1 rounded-full bg-amber-500 mt-0.5 absolute bottom-1.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-[#9B7B5E] hover:bg-orange-50/50 hover:text-amber-500 transition-colors relative">
            <Users className="w-5 h-5 mb-0.5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-[#9B7B5E] hover:bg-orange-50/50 hover:text-amber-500 transition-colors relative">
            <Calendar className="w-5 h-5 mb-0.5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-[#9B7B5E] hover:bg-orange-50/50 hover:text-amber-500 transition-colors relative">
            <MoreHorizontal className="w-5 h-5 mb-0.5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-[#9B7B5E] hover:bg-orange-50/50 hover:text-amber-500 transition-colors relative">
            <User className="w-5 h-5 mb-0.5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
