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
  Leaf,
  Euro,
  Settings
} from "lucide-react";
import { Link } from "wouter";
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
    description: "Adicionar, editar e eliminar clientes com informações de contacto, morada e tipos de serviço."
  },
  {
    icon: Calendar,
    title: "Agendamento de Serviços",
    description: "Agendar compromissos com clientes, ver calendário mensal e lista de agendamentos."
  },
  {
    icon: ClipboardList,
    title: "Registo de Atividades",
    description: "Registar serviços concluídos com descrição, fotos e tipo de serviço."
  },
  {
    icon: MapPin,
    title: "Mapa Interativo",
    description: "Visualizar clientes no mapa com navegação GPS integrada."
  },
  {
    icon: CloudSun,
    title: "Meteorologia",
    description: "Previsão do tempo com alertas para condições adversas."
  },
  {
    icon: Bell,
    title: "Lembretes",
    description: "Sistema de lembretes para manutenções regulares."
  },
  {
    icon: Euro,
    title: "Gestão Financeira",
    description: "Pagamentos, faturação e distribuição salário/empresa."
  },
  {
    icon: Leaf,
    title: "Design Mobile-First",
    description: "Interface otimizada para iPhone com PWA instalável."
  }
];

const futureIdeas = [
  {
    title: "Notificações Push",
    description: "Alertas no telemóvel para compromissos.",
    source: "sugestão"
  },
  {
    title: "Rotas Otimizadas",
    description: "Planear a melhor rota para vários clientes.",
    source: "sugestão"
  },
  {
    title: "Sincronização Cloud",
    description: "Backup automático dos dados.",
    source: "sugestão"
  }
];

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-white">Perfil</h1>
          <p className="text-white/70 text-sm mt-1">Configurações da conta</p>
        </div>
      </div>

      <div className="px-5 -mt-14 relative z-10 space-y-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
            {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Peralta Gardens
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Conta</h3>
          
          <div className="glass-card overflow-hidden divide-y divide-border/30">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="font-medium text-sm truncate">{user.email || "Sem e-mail"}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="font-medium text-sm truncate">{user.id.slice(0, 20)}...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Aplicação</h3>
          
          <div className="glass-card overflow-hidden divide-y divide-border/30">
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="w-full p-4 flex items-center gap-3 transition-colors hover:bg-muted/30 active:bg-muted/50"
                  data-testid="button-implemented-features"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">Funcionalidades</p>
                    <p className="text-xs text-muted-foreground">{implementedFeatures.length} ativas</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Funcionalidades
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-3">
                    {implementedFeatures.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 p-3 rounded-xl bg-muted/30"
                        data-testid={`implemented-feature-${index}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{feature.title}</p>
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
                  className="w-full p-4 flex items-center gap-3 transition-colors hover:bg-muted/30 active:bg-muted/50"
                  data-testid="button-future-ideas"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">Ideias Futuras</p>
                    <p className="text-xs text-muted-foreground">{futureIdeas.length} sugestões</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Ideias Futuras
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-3">
                    {futureIdeas.map((idea, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-xl border border-border/50 bg-card"
                        data-testid={`future-idea-${index}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm">{idea.title}</p>
                          <Badge variant="secondary" className="text-[10px] shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
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
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <Info className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Versão</p>
                <p className="font-semibold text-sm">1.0.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 pb-4">
          <Button 
            variant="destructive" 
            className="w-full rounded-xl h-12 gap-2 shadow-lg font-semibold"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" /> Terminar Sessão
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
