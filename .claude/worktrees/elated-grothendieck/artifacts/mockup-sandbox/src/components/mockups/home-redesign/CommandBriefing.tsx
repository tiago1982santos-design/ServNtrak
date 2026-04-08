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

export function CommandBriefing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden shadow-2xl">
      
      {/* Top Header & Progress */}
      <div className="bg-white px-5 pt-8 pb-4 rounded-b-3xl shadow-sm border-b border-gray-100 z-10 relative">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-gray-500 text-sm font-medium">Bom dia, Tiago</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">09:45</h1>
          </div>
          <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100/50">
            <Sun className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-sm font-semibold text-gray-700">22°C</span>
          </div>
        </div>

        {/* Day Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progresso de Hoje</span>
            <span className="text-sm font-bold text-[#10b981]">1 de 5 concluídos</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#10b981] w-1/5 rounded-full"></div>
            <div className="h-full w-4/5 flex">
               <div className="w-1/4 border-l border-white/50 h-full"></div>
               <div className="w-1/4 border-l border-white/50 h-full"></div>
               <div className="w-1/4 border-l border-white/50 h-full"></div>
               <div className="w-1/4 border-l border-white/50 h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">A Seguir</h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#065f46] to-[#047857] rounded-3xl p-5 shadow-[0_8px_30px_rgb(6,95,70,0.3)] text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-100" />
                  <span className="font-bold text-emerald-50 text-sm tracking-wide">10:00</span>
                </div>
                <div className="bg-orange-500 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm animate-pulse">
                  daqui a 15 min
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-3xl font-extrabold mb-1 tracking-tight">João Costa</h3>
                <div className="flex items-center gap-2 text-emerald-100 font-medium">
                  <span className="bg-blue-500/30 text-blue-100 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-400/30 flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6 bg-black/10 p-3 rounded-2xl border border-white/10">
                <div className="bg-white/20 p-2 rounded-full mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white leading-tight">Av. 25 de Abril, 15</p>
                  <p className="text-emerald-100 text-sm">Peniche</p>
                </div>
                <button className="ml-auto bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors self-center">
                  <Navigation2 className="w-5 h-5 text-white" />
                </button>
              </div>

              <button className="w-full bg-white text-[#065f46] font-extrabold text-lg py-4 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                <Play className="w-5 h-5 fill-[#065f46]" />
                INICIAR SERVIÇO
              </button>
            </div>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <button className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-2xl p-3 flex items-center justify-between text-amber-900 transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm">450€ por cobrar</span>
              <span className="text-xs text-amber-700/80 font-medium">3 serviços pendentes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </button>

        {/* QUICK ACTIONS */}
        <section>
          <div className="flex justify-between items-center px-2">
            {[
              { icon: Map, label: 'Mapa', color: 'bg-indigo-50 text-indigo-600' },
              { icon: FileText, label: 'Faturação', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Camera, label: 'Fotos', color: 'bg-purple-50 text-purple-600' },
              { icon: BarChart2, label: 'Relatórios', color: 'bg-blue-50 text-blue-600' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 group outline-none">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${action.color} shadow-sm border border-black/[0.03] group-active:scale-95 transition-transform`}>
                  <action.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-gray-600">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING STACK */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Fila de Espera</h2>
            <button className="text-xs font-bold text-[#065f46]">Ver Mapa</button>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Completed */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-50 bg-gray-50/50 opacity-60">
              <div className="flex flex-col items-center justify-center w-12">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-gray-900 line-through">Maria Silva</span>
                  <span className="text-xs font-semibold text-gray-500 line-through">08:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-gray-900">11:30</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-gray-900">Ana Rodrigues</span>
                  <span className="text-xs font-medium text-gray-500">Torres Vedras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-cyan-100 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Jacuzzi
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-gray-900">14:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-gray-900">Carlos Mendes</span>
                  <span className="text-xs font-medium text-gray-500">Lourinhã</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 text-center">
                <span className="text-sm font-bold text-gray-900">16:00</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-gray-900">Sofia Pereira</span>
                  <span className="text-xs font-medium text-gray-500">Peniche</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Piscina
                  </span>
                  <span className="text-gray-300 text-xs">+</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Jardim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#065f46]">
            <Home className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Início</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-900 transition-colors">
            <Users className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-900 transition-colors">
            <Calendar className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-900 transition-colors">
            <User className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
