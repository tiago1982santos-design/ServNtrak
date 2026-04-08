import { useClients } from "@/hooks/use-clients";
import { BottomNav } from "@/components/BottomNav";
import { Loader2, Euro, Clock, Users, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { BackButton } from "@/components/BackButton";

export default function Billing() {
  const { data: clients, isLoading } = useClients();

  const monthlyClients = clients?.filter(c => c.billingType === "monthly" && c.monthlyRate) || [];
  const hourlyClients = clients?.filter(c => c.billingType === "hourly" && c.hourlyRate) || [];
  const perVisitClients = clients?.filter(c => c.billingType === "per_visit" && c.perVisitRate) || [];
  
  const totalMonthly = monthlyClients.reduce((sum, c) => sum + (c.monthlyRate || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BackButton />
          <h1 className="text-2xl font-display font-bold text-foreground">Faturação</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gestão de valores de clientes</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="px-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Euro className="w-4 h-4 text-green-700 dark:text-green-400" />
                </div>
                <h2 className="font-bold text-lg text-foreground">Mensalidades Fixas</h2>
              </div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">{monthlyClients.length} clientes</span>
            </div>

            {monthlyClients.length > 0 ? (
              <>
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                  {monthlyClients.map((client, idx) => (
                    <Link 
                      key={client.id} 
                      href={`/clients/${client.id}`}
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${idx !== monthlyClients.length - 1 ? 'border-b border-border/50' : ''}`}
                      data-testid={`billing-monthly-client-${client.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{client.name}</span>
                      </div>
                      <span className="font-bold text-green-700 dark:text-green-400">{client.monthlyRate?.toFixed(2)} €</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Total Mensal</span>
                    <span className="text-xl font-bold text-green-700 dark:text-green-400">{totalMonthly.toFixed(2)} €</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <p className="text-muted-foreground">Sem clientes com mensalidade fixa</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                </div>
                <h2 className="font-bold text-lg text-foreground">Valor à Hora</h2>
              </div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{hourlyClients.length} clientes</span>
            </div>

            {hourlyClients.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">€/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hourlyClients.map((client, idx) => (
                        <tr 
                          key={client.id} 
                          className={`hover:bg-muted/30 transition-colors ${idx !== hourlyClients.length - 1 ? 'border-b border-border/50' : ''}`}
                          data-testid={`billing-hourly-client-${client.id}`}
                        >
                          <td className="px-4 py-3">
                            <Link href={`/clients/${client.id}`} className="font-medium text-foreground hover:text-primary">
                              {client.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-blue-700 dark:text-blue-400">{client.hourlyRate?.toFixed(2)} €</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <p className="text-muted-foreground">Sem clientes a cobrar por hora</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>
                <h2 className="font-bold text-lg text-foreground">Valor por Visita</h2>
              </div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{perVisitClients.length} clientes</span>
            </div>

            {perVisitClients.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">€/Visita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perVisitClients.map((client, idx) => (
                        <tr 
                          key={client.id} 
                          className={`hover:bg-muted/30 transition-colors ${idx !== perVisitClients.length - 1 ? 'border-b border-border/50' : ''}`}
                          data-testid={`billing-per-visit-client-${client.id}`}
                        >
                          <td className="px-4 py-3">
                            <Link href={`/clients/${client.id}`} className="font-medium text-foreground hover:text-primary">
                              {client.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-amber-700 dark:text-amber-400">{client.perVisitRate?.toFixed(2)} €</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <p className="text-muted-foreground">Sem clientes a cobrar por visita</p>
              </div>
            )}
          </section>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
