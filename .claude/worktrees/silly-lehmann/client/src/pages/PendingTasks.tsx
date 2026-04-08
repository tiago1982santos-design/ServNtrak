import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, ChevronRight, AlertTriangle, ChevronUp, Leaf, Waves, 
  ThermometerSun, Wrench, Check, Trash2, Loader2
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { BackButton } from "@/components/BackButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { PendingTaskWithClient } from "@shared/schema";

export default function PendingTasks() {
  const queryClient = useQueryClient();
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const { data: pendingTasks, isLoading } = useQuery<PendingTaskWithClient[]>({
    queryKey: ["/api/pending-tasks"],
    queryFn: async () => {
      const response = await fetch("/api/pending-tasks", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch pending tasks");
      return response.json();
    },
  });

  const deletePendingTask = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/pending-tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pending-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pending-tasks/count"] });
    },
  });

  const completePendingTask = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/pending-tasks/${taskId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to complete task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pending-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pending-tasks/count"] });
    },
  });

  const priorityLabels = { low: "Baixa", normal: "Normal", high: "Alta", urgent: "Urgente" };
  const priorityColors = {
    low: "bg-gray-100 text-gray-600",
    normal: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  };

  const filteredTasks = pendingTasks?.filter(task => {
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (typeFilter && task.serviceType !== typeFilter) return false;
    return true;
  }) || [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
  });

  const urgentCount = pendingTasks?.filter(t => t.priority === "urgent").length || 0;
  const highCount = pendingTasks?.filter(t => t.priority === "high").length || 0;

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-6 px-5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-10 flex items-center gap-3">
          <BackButton />
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white" data-testid="heading-pending-tasks">
              Tarefas Pendentes
            </h1>
            <p className="text-white/70 text-sm" data-testid="text-pending-tasks-subtitle">
              {pendingTasks?.length || 0} tarefa{pendingTasks?.length !== 1 ? "s" : ""} por completar
            </p>
          </div>
        </div>
      </div>

      {(urgentCount > 0 || highCount > 0) && (
        <div className="px-5 -mt-3 mb-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm">
              {urgentCount > 0 && <span className="font-semibold text-red-600">{urgentCount} urgente{urgentCount !== 1 ? "s" : ""}</span>}
              {urgentCount > 0 && highCount > 0 && " e "}
              {highCount > 0 && <span className="font-semibold text-orange-600">{highCount} prioritária{highCount !== 1 ? "s" : ""}</span>}
            </p>
          </div>
        </div>
      )}

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={!priorityFilter ? "default" : "outline"}
          onClick={() => setPriorityFilter(null)}
          data-testid="filter-all-priorities"
        >
          Todas
        </Button>
        {Object.entries(priorityLabels).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={priorityFilter === key ? "default" : "outline"}
            onClick={() => setPriorityFilter(priorityFilter === key ? null : key)}
            data-testid={`filter-priority-${key}`}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : sortedTasks.length > 0 ? (
          sortedTasks.map((task) => {
            const ServiceIcon = task.serviceType === "Jardim" ? Leaf :
                                task.serviceType === "Piscina" ? Waves :
                                task.serviceType === "Jacuzzi" ? ThermometerSun : Wrench;

            return (
              <div key={task.id} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/clients/${task.clientId}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid={`link-task-client-${task.id}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ServiceIcon className={`w-4 h-4 ${
                        task.serviceType === "Jardim" ? "text-green-600" :
                        task.serviceType === "Piscina" ? "text-blue-600" :
                        task.serviceType === "Jacuzzi" ? "text-orange-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{task.client.name}</p>
                      <p className="text-xs text-muted-foreground">{task.serviceType}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.normal}`}>
                      {task.priority === "urgent" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {task.priority === "high" && <ChevronUp className="w-3 h-3 mr-1" />}
                      {priorityLabels[task.priority as keyof typeof priorityLabels] || "Normal"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(task.createdAt!), "d MMM", { locale: pt })}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-3">{task.description}</p>

                {task.photos && task.photos.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    {task.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" data-testid={`button-delete-task-${task.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Tarefa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem a certeza que deseja eliminar esta tarefa pendente? Esta ação não pode ser revertida.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePendingTask.mutate(task.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="gap-1 btn-primary" data-testid={`button-complete-task-${task.id}`}>
                        <Check className="w-4 h-4" />
                        Concluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Concluir Tarefa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Confirma que esta tarefa foi concluída?
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">{task.client.name}</p>
                            <p className="text-sm font-medium text-foreground">{task.description}</p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => completePendingTask.mutate(task.id)}
                          className="btn-primary"
                        >
                          Confirmar Conclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state bg-card rounded-2xl border border-border/30 py-10">
            <div className="empty-state-icon bg-primary/5">
              <ClipboardList className="w-7 h-7 text-primary/60" />
            </div>
            <h3 className="font-semibold text-foreground">Sem tarefas pendentes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {priorityFilter ? "Nenhuma tarefa com este filtro" : "Todas as tarefas foram concluídas!"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
