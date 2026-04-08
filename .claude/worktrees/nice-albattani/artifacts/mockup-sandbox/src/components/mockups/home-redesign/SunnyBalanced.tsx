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

export function SunnyBalanced() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden shadow-sm">
      
      {/* Top Header & Progress */}
      <div className="bg-white px-5 pt-8 pb-5 rounded-b-[2rem] border-b border-[#EDE3D5] z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#9B7B5E] text-sm font-medium mb-0.5">Bom dia, Tiago</p>
            <h1 className="text-3xl font-bold text-[#2D1B0E] tracking-tight">09:45</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#FFF8E7] px-3 py-1.5 rounded-full border border-[#F0D78C]">
            <Sun className="w-5 h-5 text-[#8B6914] fill-[#8B6914]" />
            <span className="text-sm font-bold text-[#2D1B0E]">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-semibold text-[#9B7B5E] uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-semibold text-[#6B7B3A]">1 de 5 concluídos</span>
          </div>
          <div className="h-3 w-full bg-[#F5F2E8] rounded-full overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-[#6B7B3A] to-[#D4A030] w-1/5 rounded-full"></div>
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
            <Sun className="w-4 h-4 text-[#E67E22] fill-[#E67E22]" />
            <h2 className="text-sm font-bold text-[#9B7B5E] uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#E67E22] to-[#D4A030] rounded-[2rem] p-5 shadow-md text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-orange-900/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white text-sm tracking-wide">10:00</span>
                </div>
                <div className="bg-white text-[#E67E22] px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 fill-[#E67E22]" />
                  daqui a 15 min
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-2 tracking-tight text-white">João Costa</h3>
                <div className="flex items-center gap-2 font-medium">
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Piscina
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-black/10 p-3.5 rounded-2xl">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white leading-tight">Av. 25 de Abril, 15</p>
                  <p className="text-white/80 text-sm font-medium">Peniche</p>
                </div>
                <button className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors active:scale-95">
                  <Navigation2 className="w-5 h-5 text-white" />
                </button>
              </div>

              <button className="w-full bg-white text-[#E67E22] font-semibold text-lg py-4 rounded-full flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-[0.98] transition-all">
                <Play className="w-5 h-5 fill-[#E67E22]" />
                Vamos a isso!
              </button>
            </div>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-[#FFF8E7] border border-[#F0D78C] rounded-[1.5rem] p-4 flex items-center justify-between text-[#8B6914] transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white/60 p-2 rounded-full text-[#8B6914]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-base">450€ por cobrar</span>
              <span className="text-xs text-[#8B6914]/80 font-medium">3 serviços pendentes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8B6914]/60" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center px-2">
            {[
              { icon: Map, label: 'Mapa', color: 'bg-[#FFF3E0] text-[#E67E22]' },
              { icon: FileText, label: 'Faturas', color: 'bg-[#E8F5E9] text-[#2E7D32]' },
              { icon: Camera, label: 'Fotos', color: 'bg-[#E3F2FD] text-[#1565C0]' },
              { icon: BarChart2, label: 'Relatórios', color: 'bg-[#F3E5F5] text-[#7B1FA2]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2.5 group outline-none">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${action.color} border border-[#EDE3D5] group-active:scale-95 transition-transform`}>
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
            <button className="text-xs font-semibold text-[#8B6914] bg-[#FFF8E7] border border-[#F0D78C] px-3 py-1 rounded-full">Ver Mapa</button>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-[#EDE3D5] overflow-hidden shadow-sm">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-[#F0E6D8] bg-[#F5F2E8]">
              <div className="flex flex-col items-center justify-center w-12">
                <div className="bg-[#E2E6D5] p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#6B7B3A]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#9B7B5E] line-through">Maria Silva</span>
                  <span className="text-xs font-medium text-[#9B7B5E] line-through">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#6B7B3A]/80 flex items-center gap-1 bg-[#E2E6D5] px-2 py-0.5 rounded-full">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#F0E6D8] hover:bg-[#FFFCF5] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-semibold text-[#8B6914] bg-[#FFF5E0] px-2.5 py-1 rounded-lg">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#2D1B0E]">Ana Rodrigues</span>
                  <span className="text-xs font-normal text-[#9B7B5E]">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#E3F2FD] text-[#1565C0] px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#F0E6D8] hover:bg-[#FFFCF5] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-semibold text-[#8B6914] bg-[#FFF5E0] px-2.5 py-1 rounded-lg">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#2D1B0E]">Carlos Mendes</span>
                  <span className="text-xs font-normal text-[#9B7B5E]">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 hover:bg-[#FFFCF5] transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-semibold text-[#8B6914] bg-[#FFF5E0] px-2.5 py-1 rounded-lg">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-[#2D1B0E]">Sofia Pereira</span>
                  <span className="text-xs font-normal text-[#9B7B5E]">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#E3F2FD] text-[#1565C0] px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Piscina
                  </span>
                  <span className="text-[#9B7B5E]/30 text-xs font-bold">+</span>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-[#EDE3D5] pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <button className="flex flex-col items-center justify-center w-16 h-full text-[#E67E22] transition-colors relative">
            <Home className="w-5 h-5 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Início</span>
            <div className="absolute bottom-1 w-1.5 h-1.5 bg-[#E67E22] rounded-full"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-16 h-full text-[#9B7B5E] hover:text-[#E67E22] transition-colors">
            <Users className="w-5 h-5 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 h-full text-[#9B7B5E] hover:text-[#E67E22] transition-colors">
            <Calendar className="w-5 h-5 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 h-full text-[#9B7B5E] hover:text-[#E67E22] transition-colors">
            <MoreHorizontal className="w-5 h-5 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 h-full text-[#9B7B5E] hover:text-[#E67E22] transition-colors">
            <User className="w-5 h-5 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
