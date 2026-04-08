import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Settings,
  Fingerprint,
  Loader2,
  Trash2,
  KeyRound,
  Eye,
  EyeOff
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
import { BackButton } from "@/components/BackButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { startRegistration } from "@simplewebauthn/browser";

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

function BiometricSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [registering, setRegistering] = useState(false);
  const [platformAvailable, setPlatformAvailable] = useState(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(setPlatformAvailable);
    }
  }, []);

  const { data: credentials = [] } = useQuery<{ id: string; deviceName: string; createdAt: string; lastUsedAt: string | null }[]>({
    queryKey: ["/api/auth/webauthn/credentials"],
    queryFn: async () => {
      const res = await fetch("/api/auth/webauthn/credentials", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (credentialId: string) => {
      const res = await fetch(`/api/auth/webauthn/credentials/${credentialId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/webauthn/credentials"] });
      toast({ title: "Biometria removida" });
    },
  });

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/register-options", {
        method: "POST",
        credentials: "include",
      });
      if (!optionsRes.ok) throw new Error("Erro ao iniciar registo");
      const optionsJSON = await optionsRes.json();

      const attResp = await startRegistration({ optionsJSON });

      const verifyRes = await fetch("/api/auth/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: attResp, deviceName: "Dispositivo biométrico" }),
      });
      if (!verifyRes.ok) throw new Error("Verificação falhou");
      const result = await verifyRes.json();

      if (result.verified) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/webauthn/credentials"] });
        toast({ title: "Biometria registada com sucesso" });
      }
    } catch (error: any) {
      if (error.name !== "NotAllowedError") {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível registar biometria",
          variant: "destructive",
        });
      }
    } finally {
      setRegistering(false);
    }
  };

  if (!platformAvailable) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Segurança</h3>
      <div className="glass-card overflow-hidden divide-y divide-border/30">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Face ID / Biometria</p>
              <p className="text-xs text-muted-foreground">Login rápido com biometria do dispositivo</p>
            </div>
          </div>

          {credentials.length > 0 && (
            <div className="space-y-2 mb-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30" data-testid={`credential-${cred.id}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Fingerprint className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{cred.deviceName || "Dispositivo"}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(cred.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-credential-${cred.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleRegister}
            disabled={registering}
            data-testid="button-register-biometric"
          >
            {registering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Fingerprint className="w-4 h-4" />
            )}
            {credentials.length > 0 ? "Adicionar outro dispositivo" : "Ativar Face ID / Biometria"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PasswordSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { data: passwordInfo, isLoading } = useQuery<{ hasPassword: boolean }>({
    queryKey: ["/api/auth/has-password"],
  });

  const mutation = useMutation({
    mutationFn: async (data: { currentPassword?: string; newPassword: string }) => {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/has-password"] });
      setShowForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (newPassword.length < 6) {
      toast({ title: "Erro", description: "A palavra-passe deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "As palavras-passe não coincidem", variant: "destructive" });
      return;
    }
    mutation.mutate({
      currentPassword: passwordInfo?.hasPassword ? currentPassword : undefined,
      newPassword,
    });
  };

  if (isLoading) return null;

  const hasPassword = passwordInfo?.hasPassword;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Segurança</h3>
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{hasPassword ? "Alterar Palavra-passe" : "Definir Palavra-passe"}</p>
            <p className="text-xs text-muted-foreground">
              {hasPassword ? "Atualizar a sua palavra-passe de acesso" : "Adicionar palavra-passe para login com e-mail"}
            </p>
          </div>
        </div>

        {!showForm ? (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowForm(true)}
            data-testid="button-toggle-password-form"
          >
            <KeyRound className="w-4 h-4" />
            {hasPassword ? "Alterar palavra-passe" : "Definir palavra-passe"}
          </Button>
        ) : (
          <div className="space-y-3">
            {hasPassword && (
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Palavra-passe atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  data-testid="input-current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Nova palavra-passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input
              type="password"
              placeholder="Confirmar nova palavra-passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-confirm-password"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowForm(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                data-testid="button-cancel-password"
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={mutation.isPending}
                data-testid="button-save-password"
              >
                {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PushNotificationSection() {
  const { state, subscribe, unsubscribe, sendTest } = usePushNotifications();
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);

  if (state === "unsupported") {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Notificações Push</p>
            <p className="text-xs text-muted-foreground">Não suportado neste navegador</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          state === "granted" ? "bg-green-500/10" : "bg-amber-500/10"
        }`}>
          <Bell className={`w-5 h-5 ${state === "granted" ? "text-green-600" : "text-amber-600"}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Notificações Push</p>
          <p className="text-xs text-muted-foreground">
            {state === "granted" ? "Ativas neste dispositivo" :
             state === "denied" ? "Bloqueadas pelo navegador" :
             state === "loading" ? "A verificar..." :
             "Recebe alertas de compromissos"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {state === "granted" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={async () => {
                setTesting(true);
                const ok = await sendTest();
                setTesting(false);
                toast({
                  title: ok ? "Notificação enviada" : "Erro",
                  description: ok ? "Verifica o teu dispositivo." : "Não foi possível enviar.",
                  variant: ok ? "default" : "destructive",
                });
              }}
              disabled={testing}
              data-testid="button-test-push"
            >
              {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
              Testar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-destructive hover:text-destructive"
              onClick={async () => {
                const ok = await unsubscribe();
                if (ok) toast({ title: "Notificações desativadas" });
              }}
              data-testid="button-disable-push"
            >
              Desativar
            </Button>
          </>
        ) : state === "denied" ? (
          <p className="text-xs text-muted-foreground">
            Para ativar, altera as permissões de notificações nas definições do navegador.
          </p>
        ) : state !== "loading" ? (
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={async () => {
              const ok = await subscribe();
              if (ok) {
                toast({ title: "Notificações ativadas", description: "Receberás alertas neste dispositivo." });
              } else if (Notification.permission === "denied") {
                toast({ title: "Permissão negada", description: "Verifica as definições do navegador.", variant: "destructive" });
              }
            }}
            data-testid="button-enable-push"
          >
            <Bell className="w-3 h-3" />
            Ativar Notificações
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <BackButton />
            <h1 className="text-2xl font-extrabold text-white">Perfil</h1>
          </div>
          <p className="text-white/70 text-sm">Configurações da conta</p>
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
              ServNtrak
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

        <PasswordSection />

        <BiometricSection />

        <PushNotificationSection />

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
