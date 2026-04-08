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

// Design Hypothesis: "Manhã Fresca" — Ultra-Light & Airy
// Fresh, open, dewy morning lightness, gentle optimism. 
// Think: 6:30am, the garden is covered in morning dew, the air is cool and clean, light is soft and diffused.

export function ManhaFresca() {
  return (
    <div className="min-h-screen bg-[#FAFCFD] text-[#2D3748] pb-24 font-['Inter'] selection:bg-[#7CB5D4] selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Texture/Decoration (none or very light gradient) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.2] bg-gradient-to-b from-white to-transparent" />

      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Sun className="w-5 h-5 text-[#7CB5D4] stroke-[1.5]" />
            <span className="text-sm font-normal">22°C Parcialmente nublado</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#7CB5D4] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
        
        <div>
          <h1 className="text-3xl font-normal text-[#2D3748] tracking-tight">
            Bom dia, <span className="text-[#7CB5D4] font-medium">Tiago</span>
          </h1>
          <p className="text-[#94A3B8] mt-2 text-sm font-light">Pronto para mais um dia na natureza?</p>
        </div>
      </header>

      <main className="px-5 space-y-8 relative z-10">
        
        {/* Organic Stats Strip - Now Light & Airy */}
        <div className="bg-white rounded-2xl p-5 flex items-center justify-around border border-[#E2E8F0] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-[#A8D5BA]">
              <Sprout className="w-4 h-4 stroke-[2]" />
              <span className="font-medium text-[#2D3748]">5</span>
            </div>
            <span className="text-xs text-[#94A3B8] font-normal">Trabalhos</span>
          </div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#E2E8F0] to-transparent"></div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-[#7CB5D4]">
              <Check className="w-4 h-4 stroke-[2]" />
              <span className="font-medium text-[#2D3748]">1</span>
            </div>
            <span className="text-xs text-[#94A3B8] font-normal">Concluído</span>
          </div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#E2E8F0] to-transparent"></div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-[#E8B896]">
              <Banknote className="w-4 h-4 stroke-[2]" />
              <span className="font-medium text-[#2D3748]">450€</span>
            </div>
            <span className="text-xs text-[#94A3B8] font-normal">Pendentes</span>
          </div>
        </div>

        {/* Pending Payments Alert - Clean rounded card */}
        <div className="bg-[#FFF8F3] p-4 rounded-2xl border border-[#FDECDD] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E8B896] shrink-0 mt-0.5 stroke-[1.5]" />
            <div>
              <h3 className="text-[#2D3748] font-medium text-sm">Nota: Serviços por cobrar</h3>
              <p className="text-[#94A3B8] text-xs mt-1 leading-relaxed">Tens 3 serviços pendentes que totalizam 450€.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Stepping stones */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1 h-4 rounded-full bg-[#7CB5D4]"></div>
            <h2 className="text-[#2D3748] font-medium text-lg tracking-tight">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Novo', icon: Plus, color: 'bg-[#F0FAF4] text-[#A8D5BA] border-[#E2F2E8]' },
              { label: 'Cliente', icon: Users, color: 'bg-[#EFF8FA] text-[#8EC5D6] border-[#E1F1F5]' },
              { label: 'Visita', icon: MapPin, color: 'bg-[#FFF8F3] text-[#E8B896] border-[#FDECDD]' },
              { label: 'Receita', icon: Banknote, color: 'bg-[#F2F5FA] text-[#9BB5C7] border-[#E5EBF4]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2.5 group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${action.color} shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-transform active:scale-95 bg-white`}>
                  <action.icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="text-xs font-normal text-[#94A3B8]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Subtle Divider */}
        <div className="flex items-center justify-center gap-2 my-8 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></div>
        </div>

        {/* Today's Agenda */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#7CB5D4]"></div>
              <h2 className="text-[#2D3748] font-medium text-lg tracking-tight">Agenda de Hoje</h2>
            </div>
            <button className="text-sm font-medium text-[#7CB5D4] hover:text-[#5BA1C4] transition-colors">Ver tudo</button>
          </div>

          <div className="space-y-4">
            {/* Completed Task */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden opacity-60 transition-opacity hover:opacity-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-[#94A3B8] line-through">08:30</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F0FAF4] text-[#A8D5BA] text-xs font-medium border border-[#E2F2E8]">Jardim</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#F0FAF4] flex items-center justify-center border border-[#E2F2E8]">
                  <Check className="w-3.5 h-3.5 text-[#A8D5BA] stroke-[2]" />
                </div>
              </div>
              <h3 className="font-medium text-[#94A3B8] line-through text-base">Maria Silva</h3>
              <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-xs font-light">Rua das Flores, 42</span>
              </div>
            </div>

            {/* In Progress Task */}
            <div className="bg-white rounded-2xl p-4 border border-[#8EC5D6]/30 shadow-[0_4px_16px_rgba(142,197,214,0.08)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8EC5D6] to-[#7CB5D4]"></div>
              <div className="absolute -right-6 -bottom-6 opacity-5">
                <Droplets className="w-32 h-32 text-[#8EC5D6]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-[#2D3748]">10:00</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#EFF8FA] text-[#8EC5D6] text-xs font-medium border border-[#E1F1F5]">Piscina</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#E8B896] bg-[#FFF8F3] px-2.5 py-1 rounded-full text-xs font-medium border border-[#FDECDD]">
                  <Clock className="w-3 h-3 stroke-[2] animate-pulse" />
                  Em curso
                </div>
              </div>
              <h3 className="font-medium text-[#2D3748] text-lg relative z-10">João Costa</h3>
              <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-xs font-light">Av. 25 de Abril, 15</span>
              </div>
            </div>

            {/* Pending Task - Jacuzzi */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                <Waves className="w-24 h-24 text-[#9BB5C7]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-[#2D3748]">11:30</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F2F5FA] text-[#9BB5C7] text-xs font-medium border border-[#E5EBF4]">Jacuzzi</span>
                </div>
              </div>
              <h3 className="font-medium text-[#2D3748] text-base relative z-10">Ana Rodrigues</h3>
              <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-xs font-light">Travessa do Sol, 8</span>
              </div>
            </div>

            {/* Pending Task - Jardim */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                <Leaf className="w-24 h-24 text-[#A8D5BA]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-[#2D3748]">14:00</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F0FAF4] text-[#A8D5BA] text-xs font-medium border border-[#E2F2E8]">Jardim</span>
                </div>
              </div>
              <h3 className="font-medium text-[#2D3748] text-base relative z-10">Carlos Mendes</h3>
              <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-xs font-light">Rua do Mar, 23</span>
              </div>
            </div>

            {/* Pending Task - Piscina */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                <Droplets className="w-24 h-24 text-[#8EC5D6]" />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-[#2D3748]">16:00</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#EFF8FA] text-[#8EC5D6] text-xs font-medium border border-[#E1F1F5]">Piscina</span>
                </div>
              </div>
              <h3 className="font-medium text-[#2D3748] text-base relative z-10">Sofia Pereira</h3>
              <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2 relative z-10">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="text-xs font-light">Largo da Praça, 5</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-[#E2E8F0] pb-safe pt-3 px-6 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-3">
          <button className="flex flex-col items-center gap-1.5 text-[#7CB5D4]">
            <Home className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-[#94A3B8] hover:text-[#7CB5D4] transition-colors">
            <Users className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          
          <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#7CB5D4] text-white rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(124,181,212,0.2)] border-4 border-[#FAFCFD] active:scale-95 transition-transform hover:bg-[#6AA4C3]">
              <Plus className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1.5 text-[#94A3B8] hover:text-[#7CB5D4] transition-colors">
            <Calendar className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-[#94A3B8] hover:text-[#7CB5D4] transition-colors">
            <MoreHorizontal className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
