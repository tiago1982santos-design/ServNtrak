import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useClients } from "@/hooks/use-clients";
import { useCreateExpenseNote } from "@/hooks/use-expense-notes";
import { BottomNav } from "@/components/BottomNav";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos locais ───────────────────────────────────────────────────────────────

type ItemDraft = {
  description: string;
  type: "service" | "material" | "labor";
  quantity: number;
  unitPrice: number;
  total: number;
  sourceType: "manual";
};

const typeLabels: Record<ItemDraft["type"], string> = {
  service: "Serviço",
  material: "Material",
  labor: "Mão de obra",
};

const typeBadgeClass: Record<ItemDraft["type"], string> = {
  service: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  material: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  labor: "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
};

// ── Componente principal ───────────────────────────────────────────────────────

export default function ExpenseNoteNew() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const params = new URLSearchParams(window.location.search);
  const clientIdParam = params.get("clientId");
  const serviceLogIdParam = params.get("serviceLogId");

  const { data: clients } = useClients();
  const createExpenseNote = useCreateExpenseNote();

  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    clientIdParam ? parseInt(clientIdParam) : null
  );
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [notes, setNotes] = useState("");

  // ── Auto-criação a partir de service log ──────────────────────────────────
  const fromServiceLog = useMutation({
    mutationFn: async (logId: string) => {
      const res = await fetch(`/api/expense-notes/from-service-log/${logId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao criar nota a partir do registo");
      return res.json();
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["expense-notes"] });
      navigate(`/expense-notes/${note.id}`);
    },
  });

  useEffect(() => {
    if (serviceLogIdParam) {
      fromServiceLog.mutate(serviceLogIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceLogIdParam]);

  // ── Gestão de itens ───────────────────────────────────────────────────────
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "Novo item",
        type: "service",
        quantity: 1,
        unitPrice: 0,
        total: 0,
        sourceType: "manual",
      },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submissão ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedClientId || items.length === 0) return;
    const note = await createExpenseNote.mutateAsync({
      clientId: selectedClientId,
      status: "draft",
      notes: notes.trim() || null,
      items: items.map((i) => ({
        ...i,
        total: i.quantity * i.unitPrice,
        expenseNoteId: 0, // será substituído pelo servidor
      })),
    } as any);
    navigate(`/expense-notes/${note.id}`);
  };

  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const canSubmit = !!selectedClientId && items.length > 0;

  // ── Loading enquanto cria a partir de service log ─────────────────────────
  if (serviceLogIdParam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            A criar nota a partir do registo...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="pt-8 px-6 mb-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Nova Nota de Despesa
            </h1>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* ── Secção: Cliente ───────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <label className="text-sm font-semibold text-foreground block mb-3">
            Cliente
          </label>
          {clientIdParam ? (
            <p className="text-sm text-foreground font-medium">
              {clients?.find((c) => c.id === selectedClientId)?.name ??
                "A carregar..."}
            </p>
          ) : (
            <Select
              value={selectedClientId ? String(selectedClientId) : ""}
              onValueChange={(v) => setSelectedClientId(parseInt(v))}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Seleciona o cliente" />
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

        {/* ── Secção: Itens ─────────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Itens</h2>
            <button
              onClick={addItem}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Adiciona pelo menos um item
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <ItemCard
                  key={idx}
                  item={item}
                  onDelete={() => removeItem(idx)}
                />
              ))}
            </div>
          )}

          {/* Linha de total */}
          {items.length > 0 && (
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-base font-bold text-primary">
                {total.toFixed(2)} €
              </span>
            </div>
          )}
        </div>

        {/* ── Secção: Notas ─────────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <label className="text-sm font-semibold text-foreground block mb-3">
            Notas{" "}
            <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <Textarea
            placeholder="Observações adicionais (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="resize-none text-sm rounded-xl"
          />
        </div>

        {/* ── Botão de submissão ────────────────────────────────── */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!canSubmit || createExpenseNote.isPending}
        >
          {createExpenseNote.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              A criar...
            </>
          ) : (
            "Criar Nota de Despesa"
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}

// ── ItemCard ──────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  onDelete,
}: {
  item: ItemDraft;
  onDelete: () => void;
}) {
  const subtotal = item.quantity * item.unitPrice;

  return (
    <div className="flex items-start justify-between gap-3 bg-muted/40 rounded-xl p-3">
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground truncate">
          {item.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
              typeBadgeClass[item.type]
            )}
          >
            {typeLabels[item.type]}
          </span>
          <span className="text-xs text-muted-foreground">
            {item.quantity} × {item.unitPrice.toFixed(2)} €
          </span>
          <span className="text-xs font-semibold text-foreground">
            = {subtotal.toFixed(2)} €
          </span>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
        data-testid={`remove-item-${item.description}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
