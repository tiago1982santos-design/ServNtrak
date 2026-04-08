import React from 'react';
import { 
  Map,
  FileText,
  Camera,
  BarChart2,
  Home,
  Users,
  Calendar,
  MoreHorizontal,
  User,
  ArrowRight,
  Sun
} from 'lucide-react';

export function EditorialPrint() {
  const serifStyle = { fontFamily: "'Times New Roman', serif" };

  return (
    <div className="min-h-screen bg-white font-sans pb-24 mx-auto w-full max-w-[390px] relative overflow-hidden shadow-2xl text-[#111111]">
      
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-6 relative">
        <div className="flex flex-col mb-4">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#666666] mb-1">
            Bom dia, Tiago
          </p>
          <div className="flex justify-between items-end">
            <h1 className="text-6xl font-bold text-[#111111] leading-none tracking-tight" style={serifStyle}>
              09:45
            </h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#666666] pb-1">
              <Sun className="w-4 h-4" strokeWidth={1.5} />
              <span>22°C</span>
            </div>
          </div>
        </div>

        {/* Day Progress Typographic */}
        <div className="flex justify-between items-center text-xs mt-6 mb-2">
          <span className="font-bold uppercase tracking-wider text-[#666666]">Progresso</span>
          <span className="font-bold text-[#111111]">20%</span>
        </div>
        <div className="w-full text-xs tracking-widest text-[#999999] overflow-hidden whitespace-nowrap">
          <span className="text-[#111111]">▓▓</span>░░░░░░░░
        </div>
      </div>
      
      {/* Thick Black Rule */}
      <div className="w-full border-b-2 border-[#111111]"></div>

      <div className="px-5 py-6 space-y-8">
        
        {/* HERO SECTION - NEXT ACTION */}
        <section>
          <div className="flex items-center justify-between mb-3 border-t border-[#E5E5E5] pt-2">
            <h2 className="text-[10px] font-bold text-[#999999] uppercase tracking-[0.3em]">
              A Seguir
            </h2>
          </div>
          
          <div className="border-2 border-[#111111] bg-white p-5">
            <div className="flex justify-between items-start mb-6">
              <span className="text-2xl italic text-[#111111]" style={serifStyle}>
                10:00
              </span>
              <span className="text-xs font-medium text-[#999999] uppercase tracking-wider">
                daqui a 15 min
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-4xl font-bold mb-2 leading-none" style={serifStyle}>
                João Costa
              </h3>
              <p className="text-sm italic text-[#666666]" style={serifStyle}>
                — Piscina
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <ArrowRight className="w-3 h-3 text-[#111111]" strokeWidth={2} />
              <p className="text-xs font-medium text-[#666666]">
                Av. 25 de Abril, 15, Peniche
              </p>
            </div>

            <button className="w-full bg-[#111111] text-white rounded-none py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:bg-black transition-colors">
              Iniciar Serviço
            </button>
          </div>
        </section>

        {/* URGENCY STRIP */}
        <div className="border border-dashed border-[#999999] p-3 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-[#111111]">
            <span className="text-[10px]">■</span>
            <span>450€ por cobrar · 3 serviços pendentes</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#111111]" strokeWidth={1.5} />
        </div>

        {/* QUICK ACTIONS */}
        <section>
          <div className="border-y border-[#E5E5E5] py-4">
            <div className="flex justify-between items-center px-2">
              {[
                { icon: Map, label: 'Mapa' },
                { icon: FileText, label: 'Faturação' },
                { icon: Camera, label: 'Fotos' },
                { icon: BarChart2, label: 'Relatórios' },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center gap-3 group outline-none">
                  <action.icon className="w-5 h-5 text-[#111111]" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* QUEUE SECTION */}
        <section>
          <div className="border-t-2 border-[#111111] pt-3 mb-2">
            <h2 className="text-[10px] font-bold text-[#999999] uppercase tracking-[0.3em]">
              Fila de Espera
            </h2>
          </div>
          
          <div className="flex flex-col">
            {/* Completed */}
            <div className="flex items-center py-4 border-b border-[#E5E5E5]">
              <div className="w-16">
                <span className="text-sm text-[#BBBBBB]" style={serifStyle}>08:30</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#BBBBBB] line-through mb-0.5">
                  Maria Silva
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs italic text-[#BBBBBB]" style={serifStyle}>Jardim</p>
                  <span className="text-[#E5E5E5] text-xs">|</span>
                  <p className="text-xs text-[#BBBBBB]">Óbidos</p>
                </div>
              </div>
            </div>

            {/* Queue Item 1 */}
            <div className="flex items-center py-4 border-b border-[#E5E5E5]">
              <div className="w-16">
                <span className="text-sm font-bold text-[#111111]" style={serifStyle}>11:30</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111111] mb-0.5">
                  Ana Rodrigues
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs italic text-[#666666]" style={serifStyle}>Jacuzzi</p>
                  <span className="text-[#E5E5E5] text-xs">|</span>
                  <p className="text-xs text-[#999999]">Torres Vedras</p>
                </div>
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center py-4 border-b border-[#E5E5E5]">
              <div className="w-16">
                <span className="text-sm font-bold text-[#111111]" style={serifStyle}>14:00</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111111] mb-0.5">
                  Carlos Mendes
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs italic text-[#666666]" style={serifStyle}>Jardim</p>
                  <span className="text-[#E5E5E5] text-xs">|</span>
                  <p className="text-xs text-[#999999]">Lourinhã</p>
                </div>
              </div>
            </div>

            {/* Queue Item 3 */}
            <div className="flex items-center py-4 border-b border-[#E5E5E5]">
              <div className="w-16">
                <span className="text-sm font-bold text-[#111111]" style={serifStyle}>16:00</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111111] mb-0.5">
                  Sofia Pereira
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs italic text-[#666666]" style={serifStyle}>Piscina — Jardim</p>
                  <span className="text-[#E5E5E5] text-xs">|</span>
                  <p className="text-xs text-[#999999]">Peniche</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* FIXED BOTTOM NAV */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t-2 border-[#111111] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#111111]">
            <Home className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
            <div className="w-1 h-1 bg-[#111111] rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#BBBBBB] hover:text-[#666666] transition-colors">
            <Users className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Clientes</span>
            <div className="w-1 h-1 bg-transparent rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#BBBBBB] hover:text-[#666666] transition-colors">
            <Calendar className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Agenda</span>
            <div className="w-1 h-1 bg-transparent rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#BBBBBB] hover:text-[#666666] transition-colors">
            <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mais</span>
            <div className="w-1 h-1 bg-transparent rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1.5 text-[#BBBBBB] hover:text-[#666666] transition-colors">
            <User className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
            <div className="w-1 h-1 bg-transparent rounded-full mt-0.5"></div>
          </button>
        </div>
      </div>
      
    </div>
  );
}
