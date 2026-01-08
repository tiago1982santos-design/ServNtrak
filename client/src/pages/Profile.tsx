import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Perfil</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* User Card */}
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

        {/* Details */}
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

        <div className="pt-8">
          <Button 
            variant="destructive" 
            className="w-full rounded-xl h-12 gap-2 shadow-lg shadow-destructive/20"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
