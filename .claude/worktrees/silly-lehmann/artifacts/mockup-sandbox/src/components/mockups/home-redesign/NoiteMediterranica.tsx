import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Waves, 
  Settings, 
  Home, 
  Users, 
  Calendar, 
  MoreHorizontal, 
  User, 
  Plus, 
  Check, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Banknote,
  Sun,
  Sprout
} from 'lucide-react';

// Design Hypothesis: Noite Mediterrânica — Sophisticated Dark Mode
// Quiet luxury, evening calm. Deep charcoal, warm off-white, and amber accents.
// Subtle glows instead of shadows, glassy elements on dark.

export function NoiteMediterranica() {
  return (
    <div className="min-h-screen bg-[#1A1D2E] text-[#E8E4DC] pb-24 font-['Inter'] selection:bg-[#D4A855] selection:text-[#1A1D2E] relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50" 
           style={{ 
             background: 'radial-gradient(circle at 50% 0%, #232638 0%, #1A1D2E 50%)'
           }}
      />

      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#9A9690]">
            <Sun className="w-5 h-5 text-[#D4A855]" />
            <span className="text-sm font-medium tracking-wide">22°C Parcialmente nublado</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#232638] border border-[#2D3150] flex items-center justify-center text-[#E8E4DC] shadow-[0_0_15px_rgba(212,168,85,0.05)] transition-colors hover:border-[#D4A855]/50">
            <User className="w-5 h-5" />
          </button>
        </div>
        
        <div>
          <h1 className="text-3xl font-light text-[#E8E4DC] tracking-tight">
            Bom dia, <span className="font-semibold text-[#D4A855]">Tiago</span>
          </h1>
          <p className="text-[#9A9690] mt-1 text-sm font-light tracking-wide">Pronto para mais um dia na natureza?</p>
        </div>
      </header>

      <main className="px-5 space-y-6 relative z-10">
        
        {/* Glassy Stats Strip */}
        <div className="bg-[#232638]/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-around border border-[#2D3150] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#D4A855] mb-1">
              <Sprout className="w-4 h-4" />
              <span className="font-semibold text-lg">5</span>
            </div>
            <span className="text-xs text-[#9A9690] font-medium tracking-wider uppercase">Trabalhos</span>
          </div>
          <div className="w-px h-8 bg-[#2D3150]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#689999] mb-1">
              <Check className="w-4 h-4" />
              <span className="font-semibold text-lg">1</span>
            </div>
            <span className="text-xs text-[#9A9690] font-medium tracking-wider uppercase">Concluído</span>
          </div>
          <div className="w-px h-8 bg-[#2D3150]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#B07845] mb-1">
              <Banknote className="w-4 h-4" />
              <span className="font-semibold text-lg">450€</span>
            </div>
            <span className="text-xs text-[#9A9690] font-medium tracking-wider uppercase">Pendentes</span>
          </div>
        </div>

        {/* Pending Payments Alert - Formal Dark Card */}
        <div className="bg-[#232638] p-4 rounded-xl border border-[#D4A855]/30 shadow-[0_0_20px_rgba(212,168,85,0.05)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#D4A855] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(212,168,85,0.5)]" />
            <div>
              <h3 className="text-[#E8E4DC] font-medium text-sm">Nota: Serviços por cobrar</h3>
              <p className="text-[#9A9690] text-xs mt-1 leading-relaxed">Tens 3 serviços pendentes que totalizam 450€.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Sophisticated blocks */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1 h-4 rounded-full bg-[#D4A855] shadow-[0_0_8px_rgba(212,168,85,0.6)]"></div>
            <h2 className="text-[#E8E4DC] font-medium text-lg tracking-wide">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Novo', icon: Plus, color: 'bg-[#3B2F1F] text-[#D4A855] border-[#59462D]' },
              { label: 'Cliente', icon: Users, color: 'bg-[#1E3131] text-[#689999] border-[#2C4A4A]' },
              { label: 'Visita', icon: MapPin, color: 'bg-[#38281C] text-[#B07845] border-[#543E2C]' },
              { label: 'Receita', icon: Banknote, color: 'bg-[#1E3533] text-[#68A8A5] border-[#2B4E4C]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${action.color} shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.2)] transition-transform active:scale-95`}>
                  <action.icon className="w-6 h-6 opacity-90" />
                </div>
                <span className="text-[11px] font-medium text-[#9A9690] tracking-wide">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Subtle Divider - Amber Line */}
        <div className="flex items-center justify-center gap-3 opacity-60 my-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4A855]"></div>
          <div className="w-1.5 h-1.5 rotate-45 border border-[#D4A855]"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4A855]"></div>
        </div>

        {/* Today's Agenda */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#D4A855] shadow-[0_0_8px_rgba(212,168,85,0.6)]"></div>
              <h2 className="text-[#E8E4DC] font-medium text-lg tracking-wide">Agenda de Hoje</h2>
            </div>
            <button className="text-xs font-medium text-[#D4A855] uppercase tracking-wider hover:text-[#E8E4DC] transition-colors">Ver tudo</button>
          </div>

          <div className="space-y-4">
            {/* Completed Task */}
            <div className="bg-[#232638] rounded-xl p-4 border border-[#2D3150] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] relative overflow-hidden opacity-60">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#899A69]/50"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#9A9690] line-through decoration-[#9A9690]/50">08:30</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#2A3125] text-[#899A69] text-[10px] font-semibold uppercase tracking-wider border border-[#3F4B34]/50">Jardim</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#2A3125] border border-[#3F4B34] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-[#899A69]" />
                </div>
              </div>
              <h3 className="font-medium text-[#9A9690] line-through decoration-[#9A9690]/50 text-lg">Maria Silva</h3>
              <div className="flex items-center gap-1.5 text-[#9A9690] mt-2">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">Rua das Flores, 42</span>
              </div>
            </div>

            {/* In Progress Task */}
            <div className="bg-[#232638] rounded-xl p-4 border border-[#4A7B7B] shadow-[inset_0_0_20px_rgba(74,123,123,0.1),0_8px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#689999] shadow-[0_0_10px_rgba(104,153,153,0.8)]"></div>
              <div className="absolute -right-6 -top-6 opacity-[0.03]">
                <Droplets className="w-32 h-32 text-[#689999]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#E8E4DC]">10:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#1E3131] text-[#689999] text-[10px] font-semibold uppercase tracking-wider border border-[#2C4A4A]">Piscina</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#D4A855] bg-[#3B2F1F]/50 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border border-[#D4A855]/30 shadow-[0_0_10px_rgba(212,168,85,0.1)]">
                  <Clock className="w-3 h-3 animate-pulse" />
                  Em curso
                </div>
              </div>
              <h3 className="font-semibold text-[#E8E4DC] text-lg relative z-10 tracking-tight">João Costa</h3>
              <div className="flex items-center gap-1.5 text-[#9A9690] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">Av. 25 de Abril, 15</span>
              </div>
            </div>

            {/* Pending Task - Jacuzzi */}
            <div className="bg-[#232638] rounded-xl p-4 border border-[#2D3150] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#68A8A5]/70"></div>
              <div className="absolute -right-6 -top-6 opacity-[0.02]">
                <Waves className="w-32 h-32 text-[#E8E4DC]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#E8E4DC]">11:30</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#1E3533] text-[#68A8A5] text-[10px] font-semibold uppercase tracking-wider border border-[#2B4E4C]">Jacuzzi</span>
                </div>
              </div>
              <h3 className="font-medium text-[#E8E4DC] text-lg relative z-10 tracking-tight">Ana Rodrigues</h3>
              <div className="flex items-center gap-1.5 text-[#9A9690] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">Travessa do Sol, 8</span>
              </div>
            </div>

            {/* Pending Task - Jardim */}
            <div className="bg-[#232638] rounded-xl p-4 border border-[#2D3150] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#899A69]/70"></div>
              <div className="absolute -right-6 -top-6 opacity-[0.02]">
                <Leaf className="w-32 h-32 text-[#E8E4DC]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#E8E4DC]">14:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#2A3125] text-[#899A69] text-[10px] font-semibold uppercase tracking-wider border border-[#3F4B34]">Jardim</span>
                </div>
              </div>
              <h3 className="font-medium text-[#E8E4DC] text-lg relative z-10 tracking-tight">Carlos Mendes</h3>
              <div className="flex items-center gap-1.5 text-[#9A9690] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">Rua do Mar, 23</span>
              </div>
            </div>

            {/* Pending Task - Piscina */}
            <div className="bg-[#232638] rounded-xl p-4 border border-[#2D3150] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#689999]/70"></div>
              <div className="absolute -right-6 -top-6 opacity-[0.02]">
                <Droplets className="w-32 h-32 text-[#E8E4DC]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#E8E4DC]">16:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#1E3131] text-[#689999] text-[10px] font-semibold uppercase tracking-wider border border-[#2C4A4A]">Piscina</span>
                </div>
              </div>
              <h3 className="font-medium text-[#E8E4DC] text-lg relative z-10 tracking-tight">Sofia Pereira</h3>
              <div className="flex items-center gap-1.5 text-[#9A9690] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-light tracking-wide">Largo da Praça, 5</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#1A1D2E]/95 backdrop-blur-xl border-t border-[#2D3150] pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-center mb-3">
          <button className="flex flex-col items-center gap-1.5 text-[#D4A855]">
            <Home className="w-6 h-6 drop-shadow-[0_0_8px_rgba(212,168,85,0.4)]" />
            <span className="text-[10px] font-medium tracking-wide">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-[#9A9690] hover:text-[#E8E4DC] transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide">Clientes</span>
          </button>
          
          <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#D4A855] text-[#1A1D2E] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(212,168,85,0.3)] border-[4px] border-[#1A1D2E] active:scale-95 transition-transform hover:bg-[#E3BA66]">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1.5 text-[#9A9690] hover:text-[#E8E4DC] transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide">Agenda</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-[#9A9690] hover:text-[#E8E4DC] transition-colors">
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide">Mais</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
