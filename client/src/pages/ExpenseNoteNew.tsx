import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClients } from "@/hooks/use-clients";
import { BottomNav } from "@/components/BottomNav";
import { BackButton } from "@/components/BackButton";
import { Loader2, Plus, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type ItemDraft = {
  description: string;
  type: "labor" | "material" | "service";
  quantity: number;
  unitPrice: number;
};

export default function ExpenseNoteNew() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const clientIdParam = params.get("clientId");
  const serviceLogIdParam = params.get("serviceLogId");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState(clientIdParam ?? "");
  const [items, setItems] = useState<ItemDraft[]>([
    { description: "", type: "service", quantity: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = useState("");

  // Auto-create from service log
  const fromServiceLog = useMutation({
    mutationFn: async (logId: string) => {
      const res = await fetch(`/api/expense-notes/from-service-log/${logId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao criar nota");
      return res.json();
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes"] });
      setLocation(`/expense-notes/${note.id}`);
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível criar a nota a partir do registo.", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (serviceLogIdParam) {
      fromServiceLog.mutate(serviceLogIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceLogIdParam]);

  const createNote = useMutation({
    mutationFn: async () => {
      if (!selectedClientId) throw new Error("Selecciona um cliente");
      const validItems = items.filter((i) => i.description.trim());
      if (!validItems.length) throw new Error("Adiciona pelo menos um item com descrição");
      const res = await fetch("/api/expense-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: parseInt(selectedClientId),
          status: "draft",
          notes: notes.trim() || null,
          items: validItems.map((i) => ({
            description: i.description,
            type: i.type,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.quantity * i.unitPrice,
            sourceType: "manual",
            editReason: null,
          })),
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao criar nota");
      return res.json();
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes"] });
      setLocation(`/expense-notes/${note.id}`);
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const addItem = () => {
    setItems((prev) => [...prev, { description: "", type: "service", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof ItemDraft, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Loading screen while auto-creating from service log
  if (serviceLogIdParam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">A criar nota a partir do registo...</p>
        </div>
      </div>
    );
  }

  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const clientName = clients?.find((c) => c.id === parseInt(clientIdParam ?? ""))?.name;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BackButton />
          <h1 className="text-2xl font-display font-bold text-foreground">Nova Nota de Despesa</h1>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* Client */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <label className="text-sm font-semibold text-foreground block mb-2">Cliente</label>
          {clientIdParam ? (
            <p className="text-sm text-foreground font-medium">{clientName ?? "A carregar..."}</p>
          ) : (
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Items */}
        <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Itens</h2>
            <button
              onClick={addItem}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary/80"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </div>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="space-y-2 pt-3 border-t border-border/30 first:border-0 first:pt-0"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Descrição do item"
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="flex-1 text-sm"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={item.type}
                  onValueChange={(v) => updateItem(idx, "type", v)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Serviço</SelectItem>
                    <SelectItem value="labor">Mão de obra</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Qtd"
                  value={item.quantity}
                  min={0.01}
                  step={0.5}
                  onChange={(e) => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="€/un"
                  value={item.unitPrice}
                  min={0}
                  step={0.01}
                  onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
              <p className="text-xs text-right text-muted-foreground font-medium">
                Subtotal: {(item.quantity * item.unitPrice).toFixed(2)} €
              </p>
            </div>
          ))}

          <div className="pt-3 border-t border-border/50 flex justify-between items-center">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-bold text-primary">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <label className="text-sm font-semibold text-foreground block mb-2">
            Observações <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Textarea
            placeholder="Notas adicionais..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none text-sm"
          />
        </div>

        <Button
          className="w-full"
          onClick={() => createNote.mutate()}
          disabled={createNote.isPending}
        >
          {createNote.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Receipt className="w-4 h-4 mr-2" />
          )}
          Criar Nota de Despesa
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
