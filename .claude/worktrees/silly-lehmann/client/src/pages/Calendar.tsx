import { useState } from "react";
import { useAppointments, useCreateAppointment } from "@/hooks/use-appointments";
import { useClients } from "@/hooks/use-clients";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isSameDay, isAfter, startOfDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Loader2, MapPin, Clock, CheckCircle2, ChevronRight, CalendarDays, Plus, AlertTriangle, ClipboardList, Wand2, Trash2, CheckCheck } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { PendingTaskWithClient, AppointmentPreview } from "@shared/schema";

const appointmentFormSchema = z.object({
  clientId: z.number().min(1, "Selecione um cliente"),
  type: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(),
});

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: appointments, isLoading } = useAppointments();
  const { data: clients } = useClients();
  const createApt = useCreateAppointment();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [previewMonth, setPreviewMonth] = useState(new Date().getMonth() + 1);
  const [previewYear, setPreviewYear] = useState(new Date().getFullYear());
  const [previewList, setPreviewList] = useState<AppointmentPreview[]>([]);
  const [removedIndexes, setRemovedIndexes] = useState<Set<number>>(new Set());

  const generatePreviewMutation = useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      const res = await fetch("/api/appointments/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ year, month }),
      });
      if (!res.ok) throw new Error("Erro ao gerar preview");
      return res.json() as Promise<AppointmentPreview[]>;
    },
    onSuccess: (data) => {
      setPreviewList(data);
      setRemovedIndexes(new Set());
    },
    onError: () => toast({ title: "Erro", description: "Não foi possível gerar o preview.", variant: "destructive" }),
  });

  const confirmGenerateMutation = useMutation({
    mutationFn: async (appts: AppointmentPreview[]) => {
      const res = await fetch("/api/appointments/generate-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appointments: appts }),
      });
      if (!res.ok) throw new Error("Erro ao confirmar");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setGenerateOpen(false);
      setPreviewList([]);
      toast({ title: "Agendamentos criados", description: `${data.created} agendamento(s) adicionados.` });
    },
    onError: () => toast({ title: "Erro", description: "Não foi possível criar os agendamentos.", variant: "destructive" }),
  });

  const { data: allPendingTasks } = useQuery<PendingTaskWithClient[]>({
    queryKey: ["/api/pending-tasks"],
    queryFn: async () => {
      const response = await fetch("/api/pending-tasks", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch pending tasks");
      return response.json();
    },
  });

  const selectedDateAppointments = appointments?.filter(apt => 
    date && isSameDay(new Date(apt.date), date)
  ) || [];

  const daysWithAppointments = appointments?.map(a => new Date(a.date)) || [];

  const isFutureOrToday = date && (isAfter(startOfDay(date), startOfDay(new Date())) || isSameDay(date, new Date()));

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: 0,
      type: "Garden",
      notes: "",
      date: date || new Date(),
    }
  });

  const handleOpenDialog = () => {
    if (date) {
      const dateWithTime = new Date(date);
      dateWithTime.setHours(9, 0, 0, 0);
      form.reset({
        clientId: 0,
        type: "Garden",
        notes: "",
        date: dateWithTime,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof appointmentFormSchema>) => {
    try {
      await createApt.mutateAsync(values);
      setDialogOpen(false);
      form.reset();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-6 px-5">
        <div className="flex items-center gap-2 mb-2">
          <BackButton />
          <h1 className="text-2xl font-extrabold text-white">Agenda</h1>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setGenerateOpen(true)}
              data-testid="button-generate-appointments"
            >
              <Wand2 className="w-4 h-4" />
              Gerar Mês
            </Button>
          </div>
        </div>
        <p className="text-white/70 text-sm">Gerir agendamentos e visitas</p>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        <div className="glass-card p-4 mb-6">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={pt}
            modifiers={{ hasAppointment: daysWithAppointments }}
            modifiersClassNames={{
              hasAppointment: 'has-appointment'
            }}
            className="mx-auto calendar-modern"
          />
        </div>
      </div>

      <style>{`
        .calendar-modern .rdp-day_selected {
          background: hsl(var(--primary)) !important;
          color: white !important;
          border-radius: 50% !important;
          font-weight: bold;
        }
        .calendar-modern .rdp-day_today {
          border: 2px solid hsl(var(--primary));
          border-radius: 50%;
        }
        .calendar-modern .has-appointment {
          font-weight: 700;
          color: hsl(var(--primary));
        }
        .calendar-modern .has-appointment::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: hsl(var(--primary));
          border-radius: 50%;
        }
        .calendar-modern .rdp-caption_label {
          font-weight: 700;
          color: hsl(var(--foreground));
          text-transform: capitalize;
        }
        .calendar-modern .rdp-head_cell {
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          font-weight: 500;
        }
        .calendar-modern .rdp-button:hover:not(.rdp-day_selected) {
          background: hsl(var(--muted));
          border-radius: 50%;
        }
        .calendar-modern .rdp-nav_button {
          color: hsl(var(--primary));
        }
      `}</style>

      <div className="px-5 space-y-4">
        <div className="section-header flex items-center justify-between">
          <h2 className="section-title">
            {date ? format(date, "EEEE, d 'de' MMMM", { locale: pt }) : "Selecione uma data"}
          </h2>
          {isFutureOrToday && (
            <Button
              size="icon"
              className="rounded-full h-10 w-10 shadow-lg"
              onClick={handleOpenDialog}
              data-testid="button-add-appointment"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : selectedDateAppointments.length > 0 ? (
          <div className="space-y-3">
            {selectedDateAppointments.map((apt, index) => (
              <Link key={apt.id} href={`/clients/${apt.clientId}`} data-testid={`link-calendar-appointment-${apt.id}`}>
                <div 
                  className="mobile-card flex items-center gap-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold",
                    apt.type === "Garden" ? "bg-gradient-to-br from-green-100 to-green-50 text-green-700" :
                    apt.type === "Pool" ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700" :
                    apt.type === "Jacuzzi" ? "bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-700" :
                    "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700"
                  )}>
                    <span className="text-lg leading-none">{format(new Date(apt.date), "HH")}</span>
                    <span className="text-[10px] leading-none mt-0.5">{format(new Date(apt.date), "mm")}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{apt.client.name}</h3>
                    {apt.client.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{apt.client.address}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "badge-pill",
                        apt.type === "Garden" ? "bg-green-100 text-green-700" :
                        apt.type === "Pool" ? "bg-blue-100 text-blue-700" :
                        apt.type === "Jacuzzi" ? "bg-cyan-100 text-cyan-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {apt.type === 'Garden' ? 'Jardim' : apt.type === 'Pool' ? 'Piscina' : apt.type === 'Jacuzzi' ? 'Jacuzzi' : apt.type}
                      </span>
                      {apt.isCompleted && (
                        <span className="badge-pill bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> Feito
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state bg-card rounded-2xl border border-border/30">
            <div className="empty-state-icon bg-primary/5">
              <CalendarDays className="w-7 h-7 text-primary/60" />
            </div>
            <h3 className="font-semibold text-foreground">Sem agendamentos</h3>
            <p className="text-sm text-muted-foreground mt-1">Nenhuma visita marcada para este dia</p>
            {isFutureOrToday && (
              <Button
                className="mt-4"
                onClick={handleOpenDialog}
                data-testid="button-add-appointment-empty"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agendar Serviço
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Gerar Agendamentos</DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">Mês</label>
              <Select
                value={previewMonth.toString()}
                onValueChange={(v) => setPreviewMonth(Number(v))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-24 space-y-1.5">
              <label className="text-sm font-medium">Ano</label>
              <Select
                value={previewYear.toString()}
                onValueChange={(v) => setPreviewYear(Number(v))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => generatePreviewMutation.mutate({ year: previewYear, month: previewMonth })}
              disabled={generatePreviewMutation.isPending}
              className="shrink-0"
              data-testid="button-preview-generate"
            >
              {generatePreviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pré-visualizar"}
            </Button>
          </div>

          {previewList.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mt-1">
                {previewList.length - removedIndexes.size} agendamento(s) para criar.
                Clica em <Trash2 className="w-3 h-3 inline" /> para remover um agendamento da lista.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {previewList.map((appt, idx) => {
                  const removed = removedIndexes.has(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-opacity ${
                        removed ? "opacity-30 line-through" : ""
                      } ${
                        appt.type === "Garden" ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" :
                        appt.type === "Pool" ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" :
                        "border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950"
                      }`}
                      data-testid={`preview-appointment-${idx}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{appt.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(appt.date), "d 'de' MMMM", { locale: pt })} — {
                            appt.type === 'Garden' ? 'Jardim' :
                            appt.type === 'Pool' ? 'Piscina' : 'Jacuzzi'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground/70 truncate">{appt.reason}</p>
                      </div>
                      <button
                        onClick={() => {
                          const next = new Set(removedIndexes);
                          next.has(idx) ? next.delete(idx) : next.add(idx);
                          setRemovedIndexes(next);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        data-testid={`button-remove-preview-${idx}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <Button
                className="w-full gap-2 mt-2"
                disabled={confirmGenerateMutation.isPending || previewList.length === removedIndexes.size}
                onClick={() => {
                  const toCreate = previewList.filter((_, i) => !removedIndexes.has(i));
                  confirmGenerateMutation.mutate(toCreate);
                }}
                data-testid="button-confirm-generate"
              >
                {confirmGenerateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                Confirmar {previewList.length - removedIndexes.size} agendamento(s)
              </Button>
            </>
          )}

          {previewList.length === 0 && !generatePreviewMutation.isPending && generatePreviewMutation.isSuccess && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Todos os clientes já têm agendamentos para este mês.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => {
                  const clientPendingTasks = field.value ? 
                    allPendingTasks?.filter(t => t.clientId === field.value) : [];
                  const urgentTasks = clientPendingTasks?.filter(t => t.priority === 'urgent' || t.priority === 'high') || [];
                  
                  return (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(Number(v))} 
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl" data-testid="select-appointment-client">
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => {
                            const hasPendingTasks = allPendingTasks?.some(t => t.clientId === client.id);
                            return (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                <span className="flex items-center gap-2">
                                  {client.name}
                                  {hasPendingTasks && (
                                    <ClipboardList className="w-3 h-3 text-amber-500" />
                                  )}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      
                      {clientPendingTasks && clientPendingTasks.length > 0 && (
                        <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" data-testid="alert-pending-tasks">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                                {clientPendingTasks.length} tarefa{clientPendingTasks.length !== 1 ? 's' : ''} pendente{clientPendingTasks.length !== 1 ? 's' : ''}
                              </p>
                              <ul className="mt-1 space-y-1">
                                {clientPendingTasks.slice(0, 3).map(task => (
                                  <li key={task.id} className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                                    <span className="truncate">{task.description}</span>
                                    {(task.priority === 'urgent' || task.priority === 'high') && (
                                      <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-red-100 text-red-600">
                                        {task.priority === 'urgent' ? 'Urgente' : 'Alta'}
                                      </Badge>
                                    )}
                                  </li>
                                ))}
                                {clientPendingTasks.length > 3 && (
                                  <li className="text-xs text-amber-600 dark:text-amber-400">
                                    +{clientPendingTasks.length - 3} mais...
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        className="rounded-xl"
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        data-testid="input-appointment-datetime"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl" data-testid="select-appointment-type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Garden">Jardim</SelectItem>
                        <SelectItem value="Pool">Piscina</SelectItem>
                        <SelectItem value="Jacuzzi">Jacuzzi</SelectItem>
                        <SelectItem value="General">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instruções especiais..." 
                        className="rounded-xl" 
                        {...field} 
                        value={field.value || ""}
                        data-testid="textarea-appointment-notes"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full btn-primary" 
                disabled={createApt.isPending || !form.watch("clientId")}
                data-testid="button-submit-appointment"
              >
                {createApt.isPending ? "A agendar..." : "Agendar"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
