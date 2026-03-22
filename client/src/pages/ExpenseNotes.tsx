import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { BackButton } from "@/components/BackButton";
import { Loader2, Plus, FileText, CheckCircle2, Clock } from "lucide-react";
import type { ExpenseNoteWithDetails } from "@shared/schema";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function ExpenseNotes() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const clientIdParam = params.get("clientId");

  const { data: notes, isLoading } = useQuery<ExpenseNoteWithDetails[]>({
    queryKey: ["/api/expense-notes", clientIdParam],
    queryFn: async () => {
      const url = clientIdParam
        ? `/api/expense-notes?clientId=${clientIdParam}`
        : "/api/expense-notes";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Erro ao carregar notas");
      return res.json();
    },
  });

  const newHref = clientIdParam
    ? `/expense-notes/new?clientId=${clientIdParam}`
    : "/expense-notes/new";

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-8 px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BackButton />
          <h1 className="text-2xl font-display font-bold text-foreground">Notas de Despesa</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {clientIdParam ? "Notas deste cliente" : "Todas as notas de despesa"}
        </p>
      </div>

      <div className="px-6 mb-4 flex justify-end">
        <Link
          href={newHref}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Nota
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : !notes?.length ? (
        <div className="px-6">
          <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Sem notas de despesa</p>
          </div>
        </div>
      ) : (
        <div className="px-6 space-y-3">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/expense-notes/${note.id}`}
              className="block bg-card rounded-2xl border border-border/50 p-4 hover:bg-muted/30 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">#{note.noteNumber}</span>
                    {note.status === "emitida" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> Emitida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3" /> Rascunho
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{note.client.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {note.issueDate
                      ? format(new Date(note.issueDate), "d MMM yyyy", { locale: pt })
                      : format(new Date(note.createdAt!), "d MMM yyyy", { locale: pt })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-base text-primary">
                    {note.items.reduce((s, i) => s + i.total, 0).toFixed(2)} €
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {note.items.length} {note.items.length !== 1 ? "itens" : "item"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
