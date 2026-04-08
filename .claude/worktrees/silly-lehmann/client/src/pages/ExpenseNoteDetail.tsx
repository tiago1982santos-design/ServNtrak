import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { BackButton } from "@/components/BackButton";
import {
  Loader2, Pencil, Trash2, CheckCircle2, Clock,
  Download, Share2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ExpenseNoteWithDetails, ExpenseNoteItem } from "@shared/schema";
import { generateExpenseNotePdf, shareExpenseNotePdf } from "@/lib/expenseNotesPdf";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

type EditingItem = {
  index: number;
  description: string;
  type: string;
  quantity: number;
  unitPrice: number;
  editReason: string;
  wasAuto: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  service: "Serviço",
  labor: "Mão de obra",
  material: "Material",
};

export default function ExpenseNoteDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useQuery<ExpenseNoteWithDetails>({
    queryKey: ["/api/expense-notes", id],
    queryFn: async () => {
      const res = await fetch(`/api/expense-notes/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Nota não encontrada");
      return res.json();
    },
  });

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const updateItems = useMutation({
    mutationFn: async (items: Partial<ExpenseNoteItem>[]) => {
      const res = await fetch(`/api/expense-notes/${id}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao actualizar itens");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes", id] });
      setEditingItem(null);
      toast({ title: "Guardado", description: "Itens actualizados" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const emitNote = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/expense-notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "emitida", issueDate: new Date().toISOString() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao emitir nota");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes"] });
      toast({ title: "Emitida", description: "Nota de despesa emitida com sucesso" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/expense-notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao apagar nota");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expense-notes"] });
      setLocation("/expense-notes");
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = (item: ExpenseNoteItem, index: number) => {
    setEditingItem({
      index,
      description: item.description,
      type: item.type,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      editReason: item.editReason ?? "",
      wasAuto: item.sourceType === "auto",
    });
  };

  const confirmEdit = () => {
    if (!note || !editingItem) return;

    const updatedItems = note.items.map((item, idx) => {
      if (idx !== editingItem.index) {
        return {
          description: item.description,
          type: item.type,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          sourceType: item.sourceType,
          editReason: item.editReason,
        };
      }
      const valueChanged =
        item.description !== editingItem.description ||
        item.quantity !== editingItem.quantity ||
        item.unitPrice !== editingItem.unitPrice;
      const isNowEdited = valueChanged && item.sourceType === "auto";
      return {
        description: editingItem.description,
        type: editingItem.type,
        quantity: editingItem.quantity,
        unitPrice: editingItem.unitPrice,
        total: editingItem.quantity * editingItem.unitPrice,
        sourceType: isNowEdited ? "edited" : item.sourceType,
        editReason: isNowEdited ? editingItem.editReason : item.editReason,
      };
    });

    updateItems.mutate(updatedItems);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Nota não encontrada</p>
      </div>
    );
  }

  const isDraft = note.status === "draft";
  const total = note.items.reduce((s, i) => s + i.total, 0);
  const lang = (note.client as any).preferredLanguage;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="pt-8 px-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <BackButton />
          <h1 className="text-xl font-display font-bold text-foreground">
            Nota #{note.noteNumber}
          </h1>
        </div>
      </div>

      {/* Info card */}
      <div className="px-6 mb-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            {isDraft ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                <Clock className="w-3.5 h-3.5" /> Rascunho
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Emitida
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {note.issueDate
                ? format(new Date(note.issueDate), "d MMM yyyy", { locale: pt })
                : format(new Date(note.createdAt!), "d MMM yyyy", { locale: pt })}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="font-semibold text-foreground">{note.client.name}</p>
            {note.client.address && (
              <p className="text-xs text-muted-foreground">{note.client.address}</p>
            )}
          </div>
          {note.serviceLog && (
            <p className="text-xs text-muted-foreground italic">
              Referente a serviço de{" "}
              {note.serviceLog.date
                ? format(new Date(note.serviceLog.date), "d MMM yyyy", { locale: pt })
                : "—"}
            </p>
          )}
          {note.notes && (
            <p className="text-xs text-muted-foreground border-t border-border/30 pt-2">
              {note.notes}
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="px-6 mb-4">
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {note.items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 ${idx !== note.items.length - 1 ? "border-b border-border/40" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {TYPE_LABELS[item.type] ?? item.type}
                    </span>
                    {item.sourceType === "edited" && (
                      <span className="text-xs text-amber-600 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Editado
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {item.unitPrice.toFixed(2)} €
                  </p>
                  {item.sourceType === "edited" && item.editReason && (
                    <p className="text-xs text-amber-600 mt-1 italic">
                      Motivo: {item.editReason}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <span className="font-bold text-sm text-primary">{item.total.toFixed(2)} €</span>
                  {isDraft && (
                    <button
                      onClick={() => openEdit(item, idx)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Editar item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="p-4 bg-muted/30 border-t border-border/40 flex justify-between items-center">
            <span className="font-semibold text-sm">Total</span>
            <span className="font-bold text-lg text-primary">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => shareExpenseNotePdf(note, lang)}
        >
          <Share2 className="w-4 h-4 mr-2" /> Partilhar PDF
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const doc = generateExpenseNotePdf(note, lang);
            doc.save(`Nota-Despesa-${note.noteNumber}.pdf`);
          }}
        >
          <Download className="w-4 h-4 mr-2" /> Descarregar PDF
        </Button>

        {isDraft && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Emitir Nota
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emitir nota de despesa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Após emitida, a nota fica bloqueada para edição. Esta acção não pode ser revertida.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => emitNote.mutate()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Emitir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {isDraft && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" /> Apagar Nota
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar nota de despesa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acção não pode ser revertida. A nota e todos os seus itens serão eliminados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteNote.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Edit Item Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Descrição</label>
                <Input
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem((prev) => prev ? { ...prev, description: e.target.value } : null)
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Tipo</label>
                  <Select
                    value={editingItem.type}
                    onValueChange={(v) =>
                      setEditingItem((prev) => prev ? { ...prev, type: v } : null)
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Serviço</SelectItem>
                      <SelectItem value="labor">Mão de obra</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Qtd</label>
                  <Input
                    type="number"
                    min={0.01}
                    step={0.5}
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, quantity: parseFloat(e.target.value) || 0 } : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">€/un</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={editingItem.unitPrice}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, unitPrice: parseFloat(e.target.value) || 0 } : null
                      )
                    }
                  />
                </div>
              </div>

              <p className="text-right text-sm font-semibold text-primary">
                Subtotal: {(editingItem.quantity * editingItem.unitPrice).toFixed(2)} €
              </p>

              {editingItem.wasAuto && (
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Motivo da alteração{" "}
                    <span className="text-destructive">*</span>
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      (obrigatório se alterar valores do registo original)
                    </span>
                  </label>
                  <Textarea
                    placeholder="Justifica a diferença em relação ao registo original..."
                    value={editingItem.editReason}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, editReason: e.target.value } : null
                      )
                    }
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={
                updateItems.isPending ||
                (editingItem?.wasAuto && !editingItem.editReason.trim())
              }
            >
              {updateItems.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
