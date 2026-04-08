import React from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Play, 
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

export function CleanProfessional() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden">
      
      {/* Top Header & Progress */}
      <div className="bg-white px-5 pt-8 pb-5 border-b border-[#E5E7EB] z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest mb-1">Bom dia, Tiago</p>
            <h1 className="text-3xl font-extrabold text-[#111827] tabular-nums tracking-tight">09:45</h1>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#6B7280]" />
            <span className="text-sm font-semibold text-[#111827] tabular-nums">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Progresso de Hoje</span>
            <span className="text-xs font-bold text-[#111827]">1 / 5</span>
          </div>
          <div className="h-[3px] w-full bg-[#F3F4F6] overflow-hidden flex">
            <div className="h-full bg-[#4F46E5] w-1/5"></div>
            <div className="h-full w-4/5 flex">
               <div className="w-1/4 border-l border-white h-full"></div>
               <div className="w-1/4 border-l border-white h-full"></div>
               <div className="w-1/4 border-l border-white h-full"></div>
               <div className="w-1/4 border-l border-white h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="mb-3">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-white border border-[#E5E7EB] border-l-4 border-l-[#4F46E5] p-5 shadow-sm relative">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6B7280]" />
                <span className="font-bold text-[#111827] text-lg tabular-nums tracking-tight">10:00</span>
              </div>
              <div className="text-[#6B7280] font-medium text-xs">
                daqui a 15 min
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight">João Costa</h3>
              <div className="flex items-center gap-2">
                <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Piscina
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <div className="mt-0.5">
                <MapPin className="w-4 h-4 text-[#6B7280]" />
              </div>
              <div>
                <p className="font-semibold text-[#111827] text-sm">Av. 25 de Abril, 15</p>
                <p className="text-[#6B7280] text-sm">Peniche</p>
              </div>
              <button className="ml-auto text-[#4F46E5] hover:text-[#3730A3] transition-colors self-center p-1">
                <Navigation2 className="w-5 h-5" />
              </button>
            </div>

            <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4 fill-white" />
              INICIAR SERVIÇO
            </button>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-3.5 flex items-center justify-between text-[#111827] transition-colors hover:bg-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm text-[#111827]">450€ por cobrar</span>
              <span className="text-xs text-[#6B7280]">3 serviços pendentes</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center py-2">
            {[
              { icon: Map, label: 'MAPA' },
              { icon: FileText, label: 'FATURAS' },
              { icon: Camera, label: 'FOTOS' },
              { icon: BarChart2, label: 'DADOS' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2.5 group outline-none">
                <div className="text-[#6B7280] group-hover:text-[#4F46E5] transition-colors">
                  <action.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold text-[#6B7280] group-hover:text-[#4F46E5] tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING STACK */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Fila de Espera</h2>
            <button className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest hover:text-[#3730A3]">Ver Mapa</button>
          </div>
          
          <div className="bg-white border border-[#E5E7EB] overflow-hidden">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="flex flex-col items-center justify-center w-12">
                <CheckCircle2 className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#6B7280] line-through text-sm">Maria Silva</span>
                  <span className="text-xs font-medium text-[#6B7280] line-through tabular-nums">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#6B7280] flex items-center gap-1.5">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#111827] tabular-nums">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#111827] text-sm">Ana Rodrigues</span>
                  <span className="text-xs font-medium text-[#6B7280]">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#111827] tabular-nums">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#111827] text-sm">Carlos Mendes</span>
                  <span className="text-xs font-medium text-[#6B7280]">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-[#111827] tabular-nums">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#111827] text-sm">Sofia Pereira</span>
                  <span className="text-xs font-medium text-[#6B7280]">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                  <span className="text-[#E5E7EB] text-xs">+</span>
                  <span className="bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-[#E5E7EB] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#4F46E5]">
            <Home className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-bold">Início</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#6B7280] hover:text-[#111827] transition-colors">
            <Users className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#6B7280] hover:text-[#111827] transition-colors">
            <Calendar className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#6B7280] hover:text-[#111827] transition-colors">
            <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#6B7280] hover:text-[#111827] transition-colors">
            <User className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
