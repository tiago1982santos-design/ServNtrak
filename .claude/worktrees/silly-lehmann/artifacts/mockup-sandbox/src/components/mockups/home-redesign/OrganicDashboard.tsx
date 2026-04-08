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

// Design Hypothesis: Organic, botanical aesthetic for a gardening app.
// Warm earthy tones, soft textures, rounded elements, paper-like feel.

export function OrganicDashboard() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A48] pb-24 font-['Inter'] selection:bg-[#6B7B3A] selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Texture/Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236B7B3A\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
           }}
      />

      {/* Header Section */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#8A8A85]">
            <Sun className="w-5 h-5 text-[#C4835B]" />
            <span className="text-sm font-medium">22°C Parcialmente nublado</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#F3EFE6] border border-[#E8E3D5] flex items-center justify-center text-[#6B7B3A] shadow-sm">
            <User className="w-5 h-5" />
          </button>
        </div>
        
        <div>
          <h1 className="text-3xl font-serif text-[#3A3A38] tracking-tight">
            Bom dia, <span className="italic text-[#6B7B3A]">Tiago</span>
          </h1>
          <p className="text-[#8A8A85] mt-1 text-sm">Pronto para mais um dia na natureza?</p>
        </div>
      </header>

      <main className="px-5 space-y-6 relative z-10">
        
        {/* Organic Stats Strip */}
        <div className="bg-[#F3EFE6] rounded-2xl p-4 flex items-center justify-around border border-[#E8E3D5] shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#6B7B3A] mb-1">
              <Sprout className="w-4 h-4" />
              <span className="font-semibold">5</span>
            </div>
            <span className="text-xs text-[#8A8A85] font-medium">Trabalhos</span>
          </div>
          <div className="w-px h-8 bg-[#E8E3D5]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#5B8B8B] mb-1">
              <Check className="w-4 h-4" />
              <span className="font-semibold">1</span>
            </div>
            <span className="text-xs text-[#8A8A85] font-medium">Concluído</span>
          </div>
          <div className="w-px h-8 bg-[#E8E3D5]"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#C4835B] mb-1">
              <Banknote className="w-4 h-4" />
              <span className="font-semibold">450€</span>
            </div>
            <span className="text-xs text-[#8A8A85] font-medium">Pendentes</span>
          </div>
        </div>

        {/* Pending Payments Alert - Post-it style */}
        <div className="relative bg-[#FFF9E6] p-4 rounded-xl border border-[#F2DCA5] shadow-sm transform -rotate-1">
          <div className="absolute top-0 right-4 w-8 h-3 bg-[#E8D9B2] opacity-50 -translate-y-1/2 rounded-full"></div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#C4835B] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[#A66D4A] font-medium text-sm">Nota: Serviços por cobrar</h3>
              <p className="text-[#8A8A85] text-xs mt-1">Tens 3 serviços pendentes que totalizam 450€.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Stepping stones */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6B7B3A]"></div>
            <h2 className="text-[#3A3A38] font-semibold text-lg">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Novo', icon: Plus, color: 'bg-[#EAF0E2] text-[#6B7B3A] border-[#DCE4CF]' },
              { label: 'Cliente', icon: Users, color: 'bg-[#E6F0F0] text-[#5B8B8B] border-[#D6E6E6]' },
              { label: 'Visita', icon: MapPin, color: 'bg-[#F2EDEA] text-[#C4835B] border-[#E8DFDA]' },
              { label: 'Receita', icon: Banknote, color: 'bg-[#EBF1F0] text-[#6BA3A0] border-[#DCE6E5]' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${action.color} shadow-sm transition-transform active:scale-95`}>
                  <action.icon className="w-6 h-6 opacity-80" />
                </div>
                <span className="text-xs font-medium text-[#6A6A65]">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Subtle Divider */}
        <div className="flex items-center justify-center gap-2 opacity-30 my-6">
          <div className="h-px w-12 bg-[#6B7B3A]"></div>
          <Leaf className="w-4 h-4 text-[#6B7B3A]" />
          <div className="h-px w-12 bg-[#6B7B3A]"></div>
        </div>

        {/* Today's Agenda */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6B7B3A]"></div>
              <h2 className="text-[#3A3A38] font-semibold text-lg">Agenda de Hoje</h2>
            </div>
            <button className="text-sm font-medium text-[#6B7B3A]">Ver tudo</button>
          </div>

          <div className="space-y-3">
            {/* Completed Task */}
            <div className="bg-white rounded-xl p-4 border border-[#E8E3D5] shadow-sm relative overflow-hidden opacity-75">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#6B7B3A] opacity-50"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#8A8A85] line-through">08:30</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F3EFE6] text-[#8A8A85] text-xs font-medium">Jardim</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#EAF0E2] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-[#6B7B3A]" />
                </div>
              </div>
              <h3 className="font-semibold text-[#8A8A85] line-through">Maria Silva</h3>
              <div className="flex items-center gap-1.5 text-[#8A8A85] mt-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Rua das Flores, 42</span>
              </div>
            </div>

            {/* In Progress Task */}
            <div className="bg-white rounded-xl p-4 border border-[#5B8B8B] shadow-md relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5B8B8B]"></div>
              <div className="absolute -right-4 -top-4 opacity-5">
                <Droplets className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3A3A38]">10:00</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E6F0F0] text-[#5B8B8B] text-xs font-medium border border-[#D6E6E6]">Piscina</span>
                </div>
                <div className="flex items-center gap-1 text-[#C4835B] bg-[#FFF9E6] px-2 py-1 rounded-md text-xs font-medium border border-[#F2DCA5]">
                  <Clock className="w-3 h-3 animate-pulse" />
                  Em curso
                </div>
              </div>
              <h3 className="font-semibold text-[#3A3A38] text-lg relative z-10">João Costa</h3>
              <div className="flex items-center gap-1.5 text-[#6A6A65] mt-1.5 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Av. 25 de Abril, 15</span>
              </div>
            </div>

            {/* Pending Task - Jacuzzi */}
            <div className="bg-white rounded-xl p-4 border border-[#E8E3D5] shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#6BA3A0]"></div>
              <div className="absolute -right-4 -top-4 opacity-5">
                <Waves className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#4A4A48]">11:30</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EBF1F0] text-[#6BA3A0] text-xs font-medium border border-[#DCE6E5]">Jacuzzi</span>
                </div>
              </div>
              <h3 className="font-semibold text-[#3A3A38] relative z-10">Ana Rodrigues</h3>
              <div className="flex items-center gap-1.5 text-[#6A6A65] mt-1.5 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Travessa do Sol, 8</span>
              </div>
            </div>

            {/* Pending Task - Jardim */}
            <div className="bg-white rounded-xl p-4 border border-[#E8E3D5] shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#6B7B3A]"></div>
              <div className="absolute -right-4 -top-4 opacity-5">
                <Leaf className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#4A4A48]">14:00</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EAF0E2] text-[#6B7B3A] text-xs font-medium border border-[#DCE4CF]">Jardim</span>
                </div>
              </div>
              <h3 className="font-semibold text-[#3A3A38] relative z-10">Carlos Mendes</h3>
              <div className="flex items-center gap-1.5 text-[#6A6A65] mt-1.5 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Rua do Mar, 23</span>
              </div>
            </div>

            {/* Pending Task - Piscina */}
            <div className="bg-white rounded-xl p-4 border border-[#E8E3D5] shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5B8B8B]"></div>
              <div className="absolute -right-4 -top-4 opacity-5">
                <Droplets className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#4A4A48]">16:00</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E6F0F0] text-[#5B8B8B] text-xs font-medium border border-[#D6E6E6]">Piscina</span>
                </div>
              </div>
              <h3 className="font-semibold text-[#3A3A38] relative z-10">Sofia Pereira</h3>
              <div className="flex items-center gap-1.5 text-[#6A6A65] mt-1.5 relative z-10">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Largo da Praça, 5</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#FDFBF7] border-t border-[#E8E3D5] pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-center mb-2">
          <button className="flex flex-col items-center gap-1 text-[#6B7B3A]">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#8A8A85] hover:text-[#6B7B3A] transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Clientes</span>
          </button>
          
          <div className="relative -top-5">
            <button className="w-14 h-14 bg-[#6B7B3A] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#6B7B3A]/30 border-4 border-[#FDFBF7] active:scale-95 transition-transform">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1 text-[#8A8A85] hover:text-[#6B7B3A] transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Agenda</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#8A8A85] hover:text-[#6B7B3A] transition-colors">
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
