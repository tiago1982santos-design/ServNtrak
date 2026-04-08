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

// Design Hypothesis: "Terra Quente" — Warm, Bold, Rustic Portuguese
// Traditional farmhouse feel: hand-painted azulejos, terracotta pots, honest and warm.

export function TerraQuente() {
  return (
    <div className="min-h-screen bg-[#F5EDE0] text-[#3D2B1F] pb-24 font-['Inter'] selection:bg-[#C45A3C] selection:text-[#FFF9F2] relative overflow-hidden">
      
      {/* Background Subtle Texture/Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.04]" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C45A3C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
           }}
      />

      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#8B7355]">
            <Sun className="w-6 h-6 text-[#C45A3C]" strokeWidth={2.5} />
            <span className="text-sm font-bold">22°C Parcialmente nublado</span>
          </div>
          <button className="w-11 h-11 rounded-full bg-[#FFF9F2] border-2 border-[#E0CAB5] flex items-center justify-center text-[#3D2B1F] shadow-[0_2px_8px_rgba(60,30,10,0.08)]">
            <User className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        
        <div>
          <h1 className="text-3xl font-serif text-[#3D2B1F] tracking-tight font-bold">
            Bom dia, <span className="text-[#C45A3C]">Tiago</span>
          </h1>
          <p className="text-[#8B7355] mt-1 text-sm font-medium">Pronto para mais um dia na natureza?</p>
        </div>
      </header>

      <main className="px-5 space-y-6 relative z-10">
        
        {/* Organic Stats Strip */}
        <div className="bg-[#FFF9F2] rounded-2xl p-4 flex items-center justify-around border-2 border-[#E0CAB5] shadow-[0_4px_12px_rgba(60,30,10,0.08)]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#5C6B2F] mb-1">
              <Sprout className="w-5 h-5" strokeWidth={2.5} />
              <span className="font-bold text-lg">5</span>
            </div>
            <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider">Trabalhos</span>
          </div>
          <div className="w-0.5 h-10 bg-[#E0CAB5]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#3D7A8A] mb-1">
              <Check className="w-5 h-5" strokeWidth={2.5} />
              <span className="font-bold text-lg">1</span>
            </div>
            <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider">Concluído</span>
          </div>
          <div className="w-0.5 h-10 bg-[#E0CAB5]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#C45A3C] mb-1">
              <Banknote className="w-5 h-5" strokeWidth={2.5} />
              <span className="font-bold text-lg">450€</span>
            </div>
            <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider">Pendentes</span>
          </div>
        </div>

        {/* Pending Payments Alert - Post-it style */}
        <div className="relative bg-[#FFF3D6] p-4 rounded-xl border-2 border-[#D4890C] shadow-[4px_4px_12px_rgba(60,30,10,0.1)] transform -rotate-1">
          <div className="absolute top-0 right-4 w-10 h-4 bg-[#E0CAB5] opacity-80 -translate-y-1/2 rounded shadow-sm"></div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#D4890C] shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h3 className="text-[#3D2B1F] font-bold text-sm">Nota: Serviços por cobrar</h3>
              <p className="text-[#8B7355] text-xs mt-1 font-medium">Tens 3 serviços pendentes que totalizam 450€.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Stepping stones */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 rounded-full bg-[#C45A3C]"></div>
            <h2 className="text-[#3D2B1F] font-bold text-lg">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Novo', icon: Plus, color: 'bg-[#E8EDDA] text-[#5C6B2F] border-[#5C6B2F]/30' },
              { label: 'Cliente', icon: Users, color: 'bg-[#DDE8EC] text-[#3D7A8A] border-[#3D7A8A]/30' },
              { label: 'Visita', icon: MapPin, color: 'bg-[#F5E0D5] text-[#C45A3C] border-[#C45A3C]/30' },
              { label: 'Receita', icon: Banknote, color: 'bg-[#DDE8E4] text-[#4A7B6F] border-[#4A7B6F]/30' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${action.color} shadow-[0_2px_8px_rgba(60,30,10,0.08)] transition-transform active:scale-95`}>
                  <action.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-[#8B7355]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Subtle Divider */}
        <div className="flex items-center justify-center gap-3 opacity-60 my-6">
          <div className="h-0.5 w-16 bg-[#C45A3C]"></div>
          <div className="w-2 h-2 rotate-45 bg-[#C45A3C]"></div>
          <div className="h-0.5 w-16 bg-[#C45A3C]"></div>
        </div>

        {/* Today's Agenda */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C45A3C]"></div>
              <h2 className="text-[#3D2B1F] font-bold text-lg">Agenda de Hoje</h2>
            </div>
            <button className="text-sm font-bold text-[#C45A3C]">Ver tudo</button>
          </div>

          <div className="space-y-4">
            {/* Completed Task */}
            <div className="bg-[#FFF9F2] rounded-xl p-4 border-2 border-[#E0CAB5] shadow-[0_2px_8px_rgba(60,30,10,0.08)] relative overflow-hidden opacity-80">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#5C6B2F] opacity-50"></div>
              <div className="flex justify-between items-start mb-2 pl-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#8B7355] line-through">08:30</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#E8EDDA] text-[#5C6B2F] text-xs font-bold uppercase tracking-wider">Jardim</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#E8EDDA] flex items-center justify-center border-2 border-[#5C6B2F]">
                  <Check className="w-4 h-4 text-[#5C6B2F]" strokeWidth={3} />
                </div>
              </div>
              <h3 className="font-bold text-[#8B7355] line-through pl-1">Maria Silva</h3>
              <div className="flex items-center gap-1.5 text-[#8B7355] mt-1.5 pl-1 font-medium">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Rua das Flores, 42</span>
              </div>
            </div>

            {/* In Progress Task */}
            <div className="bg-[#FFF9F2] rounded-xl p-4 border-2 border-[#C45A3C] shadow-[0_6px_16px_rgba(60,30,10,0.12)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#C45A3C]"></div>
              <div className="absolute -right-4 -top-4 opacity-[0.03]">
                <Droplets className="w-24 h-24 text-[#3D2B1F]" />
              </div>
              <div className="flex justify-between items-start mb-2 pl-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#3D2B1F]">10:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#DDE8EC] text-[#3D7A8A] text-xs font-bold uppercase tracking-wider border-2 border-[#3D7A8A]/20">Piscina</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#C45A3C] bg-[#F5E0D5] px-2.5 py-1 rounded-md text-xs font-bold border-2 border-[#C45A3C]/30">
                  <Clock className="w-3.5 h-3.5 animate-pulse" strokeWidth={2.5} />
                  Em curso
                </div>
              </div>
              <h3 className="font-black text-[#3D2B1F] text-lg pl-1 relative z-10">João Costa</h3>
              <div className="flex items-center gap-1.5 text-[#8B7355] mt-1.5 pl-1 font-medium relative z-10">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Av. 25 de Abril, 15</span>
              </div>
            </div>

            {/* Pending Task - Jacuzzi */}
            <div className="bg-[#FFF9F2] rounded-xl p-4 border-2 border-[#E0CAB5] shadow-[0_4px_12px_rgba(60,30,10,0.08)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#4A7B6F]"></div>
              <div className="absolute -right-4 -top-4 opacity-[0.03]">
                <Waves className="w-24 h-24 text-[#3D2B1F]" />
              </div>
              <div className="flex justify-between items-start mb-2 pl-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3D2B1F]">11:30</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#DDE8E4] text-[#4A7B6F] text-xs font-bold uppercase tracking-wider border-2 border-[#4A7B6F]/20">Jacuzzi</span>
                </div>
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-base pl-1 relative z-10">Ana Rodrigues</h3>
              <div className="flex items-center gap-1.5 text-[#8B7355] mt-1.5 pl-1 font-medium relative z-10">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Travessa do Sol, 8</span>
              </div>
            </div>

            {/* Pending Task - Jardim */}
            <div className="bg-[#FFF9F2] rounded-xl p-4 border-2 border-[#E0CAB5] shadow-[0_4px_12px_rgba(60,30,10,0.08)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#5C6B2F]"></div>
              <div className="absolute -right-4 -top-4 opacity-[0.03]">
                <Leaf className="w-24 h-24 text-[#3D2B1F]" />
              </div>
              <div className="flex justify-between items-start mb-2 pl-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3D2B1F]">14:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#E8EDDA] text-[#5C6B2F] text-xs font-bold uppercase tracking-wider border-2 border-[#5C6B2F]/20">Jardim</span>
                </div>
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-base pl-1 relative z-10">Carlos Mendes</h3>
              <div className="flex items-center gap-1.5 text-[#8B7355] mt-1.5 pl-1 font-medium relative z-10">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Rua do Mar, 23</span>
              </div>
            </div>

            {/* Pending Task - Piscina */}
            <div className="bg-[#FFF9F2] rounded-xl p-4 border-2 border-[#E0CAB5] shadow-[0_4px_12px_rgba(60,30,10,0.08)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#3D7A8A]"></div>
              <div className="absolute -right-4 -top-4 opacity-[0.03]">
                <Droplets className="w-24 h-24 text-[#3D2B1F]" />
              </div>
              <div className="flex justify-between items-start mb-2 pl-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3D2B1F]">16:00</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#DDE8EC] text-[#3D7A8A] text-xs font-bold uppercase tracking-wider border-2 border-[#3D7A8A]/20">Piscina</span>
                </div>
              </div>
              <h3 className="font-bold text-[#3D2B1F] text-base pl-1 relative z-10">Sofia Pereira</h3>
              <div className="flex items-center gap-1.5 text-[#8B7355] mt-1.5 pl-1 font-medium relative z-10">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Largo da Praça, 5</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#FFF9F2] border-t-2 border-[#E0CAB5] pb-safe pt-2 px-6 z-50 shadow-[0_-4px_16px_rgba(60,30,10,0.05)]">
        <div className="flex justify-between items-center mb-2">
          <button className="flex flex-col items-center gap-1 text-[#C45A3C]">
            <Home className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#8B7355] hover:text-[#C45A3C] transition-colors">
            <Users className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Clientes</span>
          </button>
          
          <div className="relative -top-6">
            <button className="w-14 h-14 bg-[#C45A3C] text-[#FFF9F2] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(196,90,60,0.4)] border-4 border-[#FFF9F2] active:scale-95 transition-transform">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1 text-[#8B7355] hover:text-[#C45A3C] transition-colors">
            <Calendar className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Agenda</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#8B7355] hover:text-[#C45A3C] transition-colors">
            <MoreHorizontal className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Mais</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
