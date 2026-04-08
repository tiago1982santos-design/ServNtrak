import { useQuery, useMutation } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Clock, AlertCircle, RefreshCw, Euro, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useState, useMemo } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { ClientPaymentWithClient } from "@shared/schema";
import { BackButton } from "@/components/BackButton";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Payments() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const { toast } = useToast();

  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2].map(y => y.toString());
  }, []);

  const { data: payments, isLoading } = useQuery<ClientPaymentWithClient[]>({
    queryKey: ['/api/client-payments', selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/client-payments?year=${selectedYear}&month=${selectedMonth}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao carregar pagamentos");
      return res.json();
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/client-payments/${id}/paid`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-payments'] });
      toast({ title: "Pagamento registado", description: "O pagamento foi marcado como recebido." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível registar o pagamento.", variant: "destructive" });
    },
  });

  const generatePaymentsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/client-payments/generate', {
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-payments'] });
      const count = Array.isArray(data) ? data.length : 0;
      if (count > 0) {
        toast({ title: "Pagamentos gerados", description: `${count} pagamento(s) criado(s) para ${MONTHS[parseInt(selectedMonth) - 1]}.` });
      } else {
        toast({ title: "Sem novos pagamentos", description: "Todos os clientes já têm pagamentos para este mês." });
      }
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível gerar pagamentos.", variant: "destructive" });
    },
  });

  const paidPayments = payments?.filter(p => p.isPaid) || [];
  const unpaidPayments = payments?.filter(p => !p.isPaid) || [];
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaid = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-display font-bold text-foreground">Pagamentos</h1>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => generatePaymentsMutation.mutate()}
            disabled={generatePaymentsMutation.isPending}
            data-testid="button-generate-payments"
          >
            {generatePaymentsMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2">Gerar</span>
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="flex-1" data-testid="select-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24" data-testid="select-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Recebido</span>
              </div>
              <p className="text-lg font-bold text-green-600" data-testid="text-total-paid">
                {totalPaid.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-xs text-muted-foreground">{paidPayments.length} cliente(s)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">Pendente</span>
              </div>
              <p className="text-lg font-bold text-orange-600" data-testid="text-total-unpaid">
                {totalUnpaid.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-xs text-muted-foreground">{unpaidPayments.length} cliente(s)</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !payments || payments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Euro className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Sem pagamentos para este mês</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em "Gerar" para criar pagamentos para clientes mensais.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {unpaidPayments.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Pendentes ({unpaidPayments.length})
                </h2>
                <div className="space-y-2">
                  {unpaidPayments.map((payment) => (
                    <Card key={payment.id} className="border-orange-200 dark:border-orange-800/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Link href={`/clients/${payment.clientId}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate" data-testid={`text-client-name-${payment.id}`}>
                                  {payment.client.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.amount.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => markPaidMutation.mutate(payment.id)}
                            disabled={markPaidMutation.isPending}
                            data-testid={`button-mark-paid-${payment.id}`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Recebido
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {paidPayments.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Pagos ({paidPayments.length})
                </h2>
                <div className="space-y-2">
                  {paidPayments.map((payment) => (
                    <Card key={payment.id} className="border-green-200 dark:border-green-800/30 opacity-80">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Link href={`/clients/${payment.clientId}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate" data-testid={`text-client-name-paid-${payment.id}`}>
                                  {payment.client.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.amount.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </Link>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="w-3 h-3 mr-1" />
                            {payment.paidAt ? format(new Date(payment.paidAt), "d MMM", { locale: pt }) : "Pago"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
