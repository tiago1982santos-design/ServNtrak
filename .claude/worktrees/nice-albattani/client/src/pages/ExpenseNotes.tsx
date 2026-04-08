import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "@/hooks/use-clients";
import { BottomNav } from "@/components/BottomNav";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Receipt } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { shareExpenseNotePdf } from "@/lib/expenseNotesPdf";
import type { ExpenseNoteWithDetails } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ExpenseNotes() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const clientIdParam = params.get("clientId");

  const { data: clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(
    clientIdParam ? parseInt(clientIdParam) : undefined
  );
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { data: notes, isLoading } = useQuery<ExpenseNoteWithDetails[]>({
    queryKey: ["/api/expense-notes", selectedClientId],
    queryFn: async () => {
      const url = selectedClientId
        ? `/api/expense-notes?clientId=${selectedClientId}`
        : "/api/expense-notes";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Erro ao carregar notas de despesa");
      return res.json();
    },
  });

  const handleDownload = async (noteId: number) => {
    setDownloadingId(noteId);
    try {
      const res = await fetch(`/api/expense-notes/${noteId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Erro ao obter nota");
      const note: ExpenseNoteWithDetails = await res.json();
      await shareExpenseNotePdf(note);
    } catch {
      toast({ title: "Erro", description: "Não foi possível gerar o PDF.", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedClient = clients?.find(c => c.id === selectedClientId);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BackButton />
          <h1 className="text-2xl font-display font-bold text-foreground">Notas de Despesa</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedClient ? `Filtrado: ${selectedClient.name}` : "Todas as notas de despesa"}
        </p>
      </div>

      {/* Client filter chips */}
      {clients && clients.length > 0 && (
        <div className="px-6 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedClientId(undefined)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedClientId
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todos
            </button>
            {clients.map(client => (
              <button
                key={client.id}
                onClick={() =>
                  setSelectedClientId(client.id === selectedClientId ? undefined : client.id)
                }
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedClientId === client.id
                    ? "bg-amber-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : !notes || notes.length === 0 ? (
        <div className="px-6">
          <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
            <Receipt className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Sem notas de despesa</p>
          </div>
        </div>
      ) : (
        <div className="px-6 space-y-3">
          {notes.map(note => {
            const total = note.items?.reduce((sum, item) => sum + item.total, 0) ?? 0;
            const clientName = clients?.find(c => c.id === note.clientId)?.name ?? "—";
            return (
              <div key={note.id} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground tracking-wide">
                      {note.noteNumber}
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{clientName}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      note.status === "issued"
                        ? "border-green-300 text-green-700 bg-green-50 dark:bg-green-900/20"
                        : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/20"
                    }
                  >
                    {note.status === "issued" ? "Emitida" : "Rascunho"}
                  </Badge>
                </div>

                {note.issueDate && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(note.issueDate), "d 'de' MMM, yyyy", { locale: pt })}
                  </p>
                )}

                {note.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{note.notes}</p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <div>
                    <span className="font-bold text-foreground">{total.toFixed(2)} €</span>
                    {note.items && note.items.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {note.items.length} {note.items.length === 1 ? "item" : "itens"}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleDownload(note.id)}
                    disabled={downloadingId === note.id}
                    data-testid={`button-download-note-${note.id}`}
                  >
                    {downloadingId === note.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                    PDF
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
