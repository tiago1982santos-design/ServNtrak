import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
  CloudSun,
  ClipboardList,
  Bell,
  Leaf
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const implementedFeatures = [
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Adicionar, editar e eliminar clientes com informações de contacto, morada e tipos de serviço (jardim, piscina, jacuzzi, geral)."
  },
  {
    icon: Calendar,
    title: "Agendamento de Serviços",
    description: "Agendar compromissos com clientes, ver calendário mensal e lista de agendamentos por dia."
  },
  {
    icon: ClipboardList,
    title: "Registo de Atividades",
    description: "Registar serviços concluídos com descrição, data e tipo de serviço prestado a cada cliente."
  },
  {
    icon: MapPin,
    title: "Mapa Interativo",
    description: "Visualizar todos os clientes no mapa com vista satélite. Clicar num cliente para ver detalhes e abrir navegação GPS."
  },
  {
    icon: CloudSun,
    title: "Meteorologia Completa",
    description: "Condições atuais, previsão horária (24h) e diária (7 dias). Alertas automáticos para vento forte, chuva e trovoadas."
  },
  {
    icon: Bell,
    title: "Alertas Meteorológicos",
    description: "Avisos automáticos quando há condições adversas para trabalho no exterior nas próximas horas."
  },
  {
    icon: Leaf,
    title: "Design Peralta Gardens",
    description: "Interface mobile-first otimizada para iPhone, com tema verde natureza e logo da empresa."
  },
  {
    icon: User,
    title: "Autenticação Segura",
    description: "Login seguro através da conta Replit com sessão persistente."
  }
];

const futureIdeas = [
  {
    title: "Notificações Push",
    description: "Receber alertas no telemóvel para compromissos e avisos meteorológicos.",
    source: "sugestão"
  },
  {
    title: "Fotos nos Registos",
    description: "Adicionar fotografias do antes/depois aos registos de serviço.",
    source: "sugestão"
  },
  {
    title: "Faturação e Orçamentos",
    description: "Gerar orçamentos e faturas diretamente na app para enviar aos clientes.",
    source: "sugestão"
  },
  {
    title: "Histórico de Tratamentos",
    description: "Ver timeline completa de todos os serviços feitos a cada cliente.",
    source: "sugestão"
  },
  {
    title: "Rotas Otimizadas",
    description: "Planear a melhor rota para visitar vários clientes no mesmo dia.",
    source: "sugestão"
  },
  {
    title: "Lembretes Periódicos",
    description: "Alertas para manutenções regulares (ex: limpeza mensal de piscina).",
    source: "sugestão"
  },
  {
    title: "Relatórios e Estatísticas",
    description: "Dashboard com resumo de serviços, clientes ativos e rendimentos.",
    source: "sugestão"
  },
  {
    title: "Modo Offline",
    description: "Usar a app sem internet e sincronizar quando houver ligação.",
    source: "sugestão"
  }
];

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Perfil</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-bold font-display">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-muted-foreground">Peralta Gardens</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-2">Detalhes da Conta</h3>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-secondary-foreground">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="font-medium text-sm">{user.email || "Sem e-mail associado"}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-secondary-foreground">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">ID da Conta</p>
                <p className="font-medium text-sm truncate max-w-[200px]">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-2">Sobre a Aplicação</h3>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                  data-testid="button-implemented-features"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Funcionalidades Implementadas</p>
                    <p className="text-xs text-muted-foreground">{implementedFeatures.length} funcionalidades ativas</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Funcionalidades Implementadas
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {implementedFeatures.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 p-3 rounded-xl bg-secondary/30"
                        data-testid={`implemented-feature-${index}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{feature.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                  data-testid="button-future-ideas"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Ideias para o Futuro</p>
                    <p className="text-xs text-muted-foreground">{futureIdeas.length} ideias a implementar</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Ideias para o Futuro
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-3">
                    {futureIdeas.map((idea, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-xl border border-border bg-card"
                        data-testid={`future-idea-${index}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{idea.title}</p>
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {idea.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{idea.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-secondary-foreground">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Versão</p>
                <p className="font-medium text-sm">1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full rounded-xl h-12 gap-2 shadow-lg shadow-destructive/20"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
