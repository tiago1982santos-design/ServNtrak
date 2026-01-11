import { useState, useMemo } from "react";
import { useClients } from "@/hooks/use-clients";
import { BottomNav } from "@/components/BottomNav";
import { Link } from "wouter";
import { Search, MapPin, Leaf, Waves, ThermometerSun, Loader2, Phone, Users, Euro, Clock, ChevronRight, ArrowUpDown } from "lucide-react";
import type { Client } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ServiceFilter = "all" | "garden" | "pool" | "jacuzzi";
type SortOption = "name" | "value" | "recent";

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const stats = useMemo(() => {
    if (!clients) return { total: 0, garden: 0, pool: 0, jacuzzi: 0, monthlyRevenue: 0 };
    return {
      total: clients.length,
      garden: clients.filter(c => c.hasGarden).length,
      pool: clients.filter(c => c.hasPool).length,
      jacuzzi: clients.filter(c => c.hasJacuzzi).length,
      monthlyRevenue: clients
        .filter(c => c.billingType === 'monthly')
        .reduce((sum, c) => sum + (c.monthlyRate || 0), 0),
    };
  }, [clients]);

  const filteredAndSortedClients = useMemo(() => {
    let result = clients?.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.address?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (serviceFilter !== "all") {
      result = result.filter(c => {
        if (serviceFilter === "garden") return c.hasGarden;
        if (serviceFilter === "pool") return c.hasPool;
        if (serviceFilter === "jacuzzi") return c.hasJacuzzi;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "value") {
        const aValue = a.monthlyRate || a.hourlyRate || 0;
        const bValue = b.monthlyRate || b.hourlyRate || 0;
        return bValue - aValue;
      }
      if (sortBy === "recent") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

    return result;
  }, [clients, search, serviceFilter, sortBy]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getClientValue = (client: Client) => {
    if (client.billingType === 'monthly' && client.monthlyRate) {
      return `${client.monthlyRate}€/mês`;
    }
    if (client.billingType === 'hourly' && client.hourlyRate) {
      return `${client.hourlyRate}€/hora`;
    }
    return null;
  };

  const filterButtons: { key: ServiceFilter; label: string; icon: typeof Leaf; color: string }[] = [
    { key: "all", label: "Todos", icon: Users, color: "text-foreground" },
    { key: "garden", label: "Jardim", icon: Leaf, color: "text-green-600 dark:text-green-400" },
    { key: "pool", label: "Piscina", icon: Waves, color: "text-blue-600 dark:text-blue-400" },
    { key: "jacuzzi", label: "Jacuzzi", icon: ThermometerSun, color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold text-foreground">Clientes</h1>
          <CreateClientDialog />
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar clientes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-none shadow-inner"
            data-testid="input-search-clients"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-3 text-center">
              <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-primary" data-testid="text-total-clients">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-3 text-center">
              <Leaf className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.garden}</p>
              <p className="text-[10px] text-muted-foreground">Jardim</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-3 text-center">
              <Waves className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.pool}</p>
              <p className="text-[10px] text-muted-foreground">Piscina</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-3 text-center">
              <Euro className="w-4 h-4 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.monthlyRevenue}€</p>
              <p className="text-[10px] text-muted-foreground">Mensal</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-1 overflow-x-auto pb-1">
            {filterButtons.map(({ key, label, icon: Icon, color }) => (
              <Button
                key={key}
                size="sm"
                variant={serviceFilter === key ? "default" : "outline"}
                onClick={() => setServiceFilter(key)}
                className={`flex-shrink-0 h-8 text-xs ${serviceFilter !== key ? color : ''}`}
                data-testid={`button-filter-${key}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8" data-testid="button-sort">
                <ArrowUpDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")} data-testid="sort-name">
                Por Nome {sortBy === "name" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("value")} data-testid="sort-value">
                Por Valor {sortBy === "value" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")} data-testid="sort-recent">
                Mais Recentes {sortBy === "recent" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredAndSortedClients.length > 0 ? (
          filteredAndSortedClients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="hover-elevate cursor-pointer transition-all duration-200" data-testid={`card-client-${client.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{getInitials(client.name)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground truncate" data-testid={`text-client-name-${client.id}`}>
                            {client.name}
                          </h3>
                          {client.address && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{client.address}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getClientValue(client) && (
                            <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0">
                              {client.billingType === 'monthly' ? (
                                <Euro className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {getClientValue(client)}
                            </Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex gap-1.5 flex-1">
                          {client.hasGarden && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                              <Leaf className="w-2.5 h-2.5 mr-1" />
                              Jardim
                            </Badge>
                          )}
                          {client.hasPool && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                              <Waves className="w-2.5 h-2.5 mr-1" />
                              Piscina
                            </Badge>
                          )}
                          {client.hasJacuzzi && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0">
                              <ThermometerSun className="w-2.5 h-2.5 mr-1" />
                              Jacuzzi
                            </Badge>
                          )}
                        </div>
                        {client.phone && (
                          <a 
                            href={`tel:${client.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                            data-testid={`button-call-${client.id}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Nenhum cliente encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || serviceFilter !== "all" 
                  ? "Tente ajustar os filtros de pesquisa"
                  : "Adicione o seu primeiro cliente para começar!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
