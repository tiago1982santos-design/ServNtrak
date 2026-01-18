import { useState, useRef, useMemo } from "react";
import { useParams, Link } from "wouter";
import { useClient, useUpdateClient } from "@/hooks/use-clients";
import { useServiceLogs, useCreateServiceLog } from "@/hooks/use-service-logs";
import { useQuickPhotos, useDeleteQuickPhoto } from "@/hooks/use-quick-photos";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "@/hooks/use-appointments";
import { useClientServiceStats, useCreateServiceVisit } from "@/hooks/use-service-visits";
import { useUpload } from "@/hooks/use-upload";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Phone, MapPin, Leaf, Waves, ThermometerSun, Plus, Calendar, CheckCircle2, Camera, X, Image as ImageIcon, Pencil, Euro, Clock, Flower2, Sparkles, FolderPlus, Users, Timer, Check, MessageCircle } from "lucide-react";
import { SiWhatsapp, SiFacebook } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertServiceLogSchema, insertAppointmentSchema, insertClientSchema, type Client, type ServiceLog, type Appointment, type QuickPhoto, type Employee } from "@shared/schema";
import { createServiceLogWithEntriesInput } from "@shared/routes";
import { getClientVisitSchedule, getSeason, getSeasonLabel, getTotalMonthlyVisits } from "@shared/scheduling";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function ClientDetail() {
  const { id } = useParams();
  const clientId = parseInt(id || "0");
  const { data: client, isLoading } = useClient(clientId);
  const { data: logs } = useServiceLogs(id);
  const { data: appointments } = useAppointments({ clientId: id });
  const { data: quickPhotos } = useQuickPhotos(id);
  const { data: serviceStats } = useClientServiceStats(clientId);
  const deleteQuickPhoto = useDeleteQuickPhoto();

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary" /></div>;
  if (!client) return <div>Cliente não encontrado</div>;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-8 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/clients" className="inline-flex items-center text-primary-foreground/80 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Link>
            <EditClientDialog client={client} />
          </div>
          
          <h1 className="text-3xl font-display font-bold">{client.name}</h1>
          
          <div className="flex flex-col gap-2 mt-4 text-primary-foreground/90">
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-sm hover:underline">
                <Phone className="w-4 h-4" /> {client.phone}
              </a>
            )}
            {client.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" /> {client.address}
              </div>
            )}
          </div>

          {/* Messaging Buttons */}
          {(client.phone || client.whatsapp || client.facebookMessenger) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(client.whatsapp || client.phone) && (
                <a
                  href={`https://wa.me/${(client.whatsapp || client.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                  data-testid="button-whatsapp"
                >
                  <SiWhatsapp className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {client.phone && (
                <a
                  href={`sms:${client.phone}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  data-testid="button-sms"
                >
                  <MessageCircle className="w-4 h-4" />
                  SMS
                </a>
              )}
              {client.facebookMessenger && (
                <a
                  href={`https://m.me/${client.facebookMessenger}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#0084FF] text-white rounded-lg text-sm font-medium hover:bg-[#0073e6] transition-colors"
                  data-testid="button-messenger"
                >
                  <SiFacebook className="w-4 h-4" />
                  Messenger
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Services Tags */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50 flex flex-wrap gap-3">
          {client.hasGarden && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <Leaf className="w-4 h-4" /> Jardim
            </div>
          )}
          {client.hasPool && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Waves className="w-4 h-4" /> Piscina
              {client.poolLength && client.poolWidth && client.poolMinDepth && client.poolMaxDepth && (
                <span className="text-xs font-bold">
                  ({(client.poolLength * client.poolWidth * ((client.poolMinDepth + client.poolMaxDepth) / 2)).toFixed(0)} m³)
                </span>
              )}
            </div>
          )}
          {client.hasJacuzzi && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
              <ThermometerSun className="w-4 h-4" /> Jacuzzi
              {client.jacuzziLength && client.jacuzziWidth && client.jacuzziDepth && (
                <span className="text-xs font-bold">
                  ({(client.jacuzziLength * client.jacuzziWidth * client.jacuzziDepth).toFixed(0)} m³)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visit Schedule Info */}
      {(client.hasGarden || client.hasPool || client.hasJacuzzi) && (
        <div className="px-6 mt-4">
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Frequência de Visitas</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeason(new Date()) === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {getSeasonLabel(getSeason(new Date()))}
              </span>
            </div>
            <div className="space-y-2">
              {getClientVisitSchedule(client).map((schedule) => (
                <div key={schedule.type} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {schedule.type === 'Garden' && <Leaf className="w-3.5 h-3.5 text-green-600" />}
                    {schedule.type === 'Pool' && <Waves className="w-3.5 h-3.5 text-blue-600" />}
                    {schedule.type === 'Jacuzzi' && <ThermometerSun className="w-3.5 h-3.5 text-orange-600" />}
                    <span>{schedule.type === 'Garden' ? 'Jardim' : schedule.type === 'Pool' ? 'Piscina' : 'Jacuzzi'}</span>
                  </span>
                  <span className="text-muted-foreground text-xs">{schedule.description}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t flex justify-between text-sm font-medium">
                <span>Total este mês:</span>
                <span className="text-primary">{getTotalMonthlyVisits(client)} visitas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Statistics */}
      {serviceStats && serviceStats.totalVisits > 0 && (
        <div className="px-6 mt-4">
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <h3 className="font-semibold text-sm mb-3">Estatísticas de Visitas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total visitas</p>
                  <p className="font-semibold">{serviceStats.totalVisits}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duração média</p>
                  <p className="font-semibold">{serviceStats.averageDurationMinutes} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Média trabalhadores</p>
                  <p className="font-semibold">{serviceStats.averageWorkerCount.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total horas</p>
                  <p className="font-semibold">{serviceStats.totalWorkerHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="px-6 mt-6">
        <Tabs defaultValue="history">
          <TabsList className="w-full bg-muted/50 p-1 rounded-xl mb-6">
            <TabsTrigger value="history" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Histórico</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Timeline</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Registos de Serviço</h3>
              <AddServiceLogDialog clientId={clientId} />
            </div>

            {logs?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">Ainda sem histórico de serviço.</p>
            ) : (
              logs?.map((log) => (
                <div key={log.id} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                      {log.type === 'Garden' ? 'Jardim' : log.type === 'Pool' ? 'Piscina' : log.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.date), "d 'de' MMM, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{log.description}</p>
                </div>
              ))
            )}

            {/* Quick Photos Section - Organized by Category */}
            {quickPhotos && quickPhotos.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">Capturas Rápidas</h3>
                {(() => {
                  const grouped = quickPhotos.reduce((acc, photo) => {
                    const category = photo.serviceType === "Outros" && photo.customCategory 
                      ? photo.customCategory 
                      : photo.serviceType || "Geral";
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(photo);
                    return acc;
                  }, {} as Record<string, typeof quickPhotos>);
                  
                  const categoryIcons: Record<string, typeof Flower2> = {
                    "Jardim": Flower2,
                    "Piscina": Waves,
                    "Jacuzzi": Sparkles,
                    "Outros": FolderPlus,
                    "Geral": Camera,
                  };
                  
                  const categoryOrder = ["Jardim", "Piscina", "Jacuzzi"];
                  const sortedCategories = [
                    ...categoryOrder.filter(c => grouped[c]),
                    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c) && c !== "Outros" && c !== "Geral"),
                    ...(grouped["Outros"] ? ["Outros"] : []),
                    ...(grouped["Geral"] ? ["Geral"] : []),
                  ];
                  
                  return sortedCategories.map((category) => {
                    const Icon = categoryIcons[category] || FolderPlus;
                    return (
                      <div key={category} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{category}</span>
                          <span className="text-xs text-muted-foreground">({grouped[category].length})</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {grouped[category].map((photo) => (
                            <div key={photo.id} className="relative group aspect-square">
                              <img
                                src={photo.photoUrl}
                                alt={`Captura - ${category}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20"
                                  onClick={() => deleteQuickPhoto.mutate(photo.id)}
                                  data-testid={`button-delete-quick-photo-${photo.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/50 rounded px-1 truncate">
                                {format(new Date(photo.createdAt!), "dd/MM/yy")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <ClientTimeline logs={logs || []} appointments={appointments || []} quickPhotos={quickPhotos || []} />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Agendamentos</h3>
              <AddAppointmentDialog clientId={clientId} />
            </div>
            
            {appointments?.filter(a => !a.isCompleted).length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">Sem agendamentos futuros.</p>
            ) : (
              appointments?.filter(a => !a.isCompleted).map((apt) => (
                <div key={apt.id} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary shrink-0">
                    <span className="text-xs font-bold uppercase">{format(new Date(apt.date), "MMM")}</span>
                    <span className="text-lg font-bold leading-none">{format(new Date(apt.date), "d")}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Serviço de {apt.type === 'Garden' ? 'Jardim' : apt.type === 'Pool' ? 'Piscina' : apt.type}</h4>
                    <p className="text-sm text-muted-foreground">{format(new Date(apt.date), "HH:mm")}</p>
                  </div>
                  <CompleteVisitDialog 
                    clientId={clientId} 
                    appointmentId={apt.id}
                    appointmentType={apt.type}
                    estimatedDuration={client.serviceDurationMinutes || 60}
                  />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type LaborEntry = { employeeId?: number; workerName: string; hours: number; hourlyRate: number; hourlyPayRate?: number; cost: number };
type MaterialEntry = { materialName: string; quantity: number; unitPrice: number; cost: number };

const serviceLogFormSchema = insertServiceLogSchema.extend({
  type: z.enum(["Garden", "Pool", "Jacuzzi", "General"]),
  description: z.string().min(1, "Descrição obrigatória"),
  billingType: z.enum(["monthly", "extra"]).default("monthly"),
});

function AddServiceLogDialog({ clientId }: { clientId: number }) {
  const [open, setOpen] = useState(false);
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);
  const [laborEntries, setLaborEntries] = useState<LaborEntry[]>([]);
  const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const createLog = useCreateServiceLog();
  const { uploadFile, isUploading } = useUpload();
  
  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });
  
  const form = useForm<z.infer<typeof serviceLogFormSchema>>({
    resolver: zodResolver(serviceLogFormSchema),
    defaultValues: {
      clientId,
      type: "Garden",
      description: "",
      date: new Date(),
      billingType: "monthly",
    }
  });

  const laborSubtotal = laborEntries.reduce((sum, e) => sum + e.cost, 0);
  const materialsSubtotal = materialEntries.reduce((sum, e) => sum + e.cost, 0);
  const total = laborSubtotal + materialsSubtotal;

  const activeEmployees = employees?.filter(e => e.isActive) || [];

  const addLaborEntry = () => {
    setLaborEntries([...laborEntries, { employeeId: undefined, workerName: "", hours: 0, hourlyRate: 0, hourlyPayRate: 0, cost: 0 }]);
  };

  const selectEmployee = (index: number, employeeId: string) => {
    const updated = [...laborEntries];
    if (employeeId === "manual") {
      updated[index].employeeId = undefined;
      updated[index].workerName = "";
      updated[index].hourlyRate = 0;
      updated[index].hourlyPayRate = 0;
    } else {
      const emp = employees?.find(e => e.id === parseInt(employeeId));
      if (emp) {
        updated[index].employeeId = emp.id;
        updated[index].workerName = emp.name;
        updated[index].hourlyRate = Number(emp.hourlyChargeRate) || 0;
        updated[index].hourlyPayRate = Number(emp.hourlyPayRate) || 0;
      }
    }
    updated[index].cost = updated[index].hours * updated[index].hourlyRate;
    setLaborEntries(updated);
  };

  const updateLaborEntry = (index: number, field: keyof LaborEntry, value: string | number) => {
    const updated = [...laborEntries];
    if (field === "workerName") {
      updated[index].workerName = value as string;
    } else if (field === "employeeId") {
      updated[index].employeeId = value ? Number(value) : undefined;
    } else {
      updated[index][field] = Number(value) || 0;
    }
    updated[index].cost = updated[index].hours * updated[index].hourlyRate;
    setLaborEntries(updated);
  };

  const removeLaborEntry = (index: number) => {
    setLaborEntries(laborEntries.filter((_, i) => i !== index));
  };

  const addMaterialEntry = () => {
    setMaterialEntries([...materialEntries, { materialName: "", quantity: 0, unitPrice: 0, cost: 0 }]);
  };

  const updateMaterialEntry = (index: number, field: keyof MaterialEntry, value: string | number) => {
    const updated = [...materialEntries];
    if (field === "materialName") {
      updated[index].materialName = value as string;
    } else {
      updated[index][field] = Number(value) || 0;
    }
    updated[index].cost = updated[index].quantity * updated[index].unitPrice;
    setMaterialEntries(updated);
  };

  const removeMaterialEntry = (index: number) => {
    setMaterialEntries(materialEntries.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = async (file: File, type: "before" | "after") => {
    const result = await uploadFile(file);
    if (result) {
      if (type === "before") {
        setPhotosBefore(prev => [...prev, result.objectPath]);
      } else {
        setPhotosAfter(prev => [...prev, result.objectPath]);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof serviceLogFormSchema>) => {
    try {
      await createLog.mutateAsync({
        ...values,
        photosBefore,
        photosAfter,
        laborEntries: laborEntries.filter(e => e.workerName && e.hours > 0),
        materialEntries: materialEntries.filter(e => e.materialName && e.quantity > 0),
      });
      setOpen(false);
      form.reset();
      setPhotosBefore([]);
      setPhotosAfter([]);
      setLaborEntries([]);
      setMaterialEntries([]);
    } catch (e) {}
  };

  const removePhoto = (type: "before" | "after", index: number) => {
    if (type === "before") {
      setPhotosBefore(prev => prev.filter((_, i) => i !== index));
    } else {
      setPhotosAfter(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 rounded-lg" data-testid="button-add-service-log">
          <Plus className="w-3 h-3" /> Registar Trabalho
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registar Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl" data-testid="select-service-type">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="O que fez hoje?" 
                      className="rounded-xl" 
                      data-testid="input-service-description"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Faturação</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className={`flex items-center space-x-2 rounded-xl border p-3 cursor-pointer transition-colors ${field.value === 'monthly' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                        <RadioGroupItem value="monthly" id="billing-monthly" />
                        <Label htmlFor="billing-monthly" className="flex items-center gap-2 cursor-pointer">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Mensal</span>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 rounded-xl border p-3 cursor-pointer transition-colors ${field.value === 'extra' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                        <RadioGroupItem value="extra" id="billing-extra" />
                        <Label htmlFor="billing-extra" className="flex items-center gap-2 cursor-pointer">
                          <Euro className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">Extra</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3 p-3 rounded-xl border bg-blue-50/50">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  Mão de Obra
                </FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={addLaborEntry} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              {laborEntries.length > 0 && (
                <div className="space-y-3">
                  {laborEntries.map((entry, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/50 border space-y-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={entry.employeeId?.toString() || "manual"}
                          onValueChange={(val) => selectEmployee(idx, val)}
                        >
                          <SelectTrigger className="flex-1 h-8 text-xs rounded-lg" data-testid={`select-employee-${idx}`}>
                            <SelectValue placeholder="Selecionar funcionário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Entrada manual</SelectItem>
                            {activeEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.name} ({Number(emp.hourlyChargeRate).toFixed(0)}€/h)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeLaborEntry(idx)} className="h-6 w-6 shrink-0">
                          <X className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                      {!entry.employeeId && (
                        <Input
                          placeholder="Nome do trabalhador"
                          value={entry.workerName}
                          onChange={(e) => updateLaborEntry(idx, "workerName", e.target.value)}
                          className="h-8 text-xs rounded-lg"
                          data-testid={`input-worker-name-${idx}`}
                        />
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground">Horas</label>
                          <Input
                            type="number"
                            step="0.5"
                            placeholder="0"
                            value={entry.hours || ""}
                            onChange={(e) => updateLaborEntry(idx, "hours", e.target.value)}
                            className="h-8 text-xs rounded-lg"
                            data-testid={`input-hours-${idx}`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">€/hora</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={entry.hourlyRate || ""}
                            onChange={(e) => updateLaborEntry(idx, "hourlyRate", e.target.value)}
                            className="h-8 text-xs rounded-lg"
                            data-testid={`input-rate-${idx}`}
                            disabled={!!entry.employeeId}
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <label className="text-[10px] text-muted-foreground">Total</label>
                          <div className="h-8 flex items-center justify-end text-sm font-semibold text-blue-700">
                            {entry.cost.toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-sm font-bold text-blue-700 pt-1 border-t">
                    Subtotal: {laborSubtotal.toFixed(2)}€
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 p-3 rounded-xl border bg-orange-50/50">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2 text-orange-700">
                  <FolderPlus className="w-4 h-4" />
                  Materiais
                </FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={addMaterialEntry} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              {materialEntries.length > 0 && (
                <div className="space-y-2">
                  {materialEntries.map((entry, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 items-center">
                      <Input
                        placeholder="Material"
                        value={entry.materialName}
                        onChange={(e) => updateMaterialEntry(idx, "materialName", e.target.value)}
                        className="col-span-4 h-8 text-xs rounded-lg"
                      />
                      <Input
                        type="number"
                        placeholder="Qtd"
                        value={entry.quantity || ""}
                        onChange={(e) => updateMaterialEntry(idx, "quantity", e.target.value)}
                        className="col-span-2 h-8 text-xs rounded-lg"
                      />
                      <Input
                        type="number"
                        placeholder="€/un"
                        value={entry.unitPrice || ""}
                        onChange={(e) => updateMaterialEntry(idx, "unitPrice", e.target.value)}
                        className="col-span-2 h-8 text-xs rounded-lg"
                      />
                      <div className="col-span-3 text-xs font-medium text-right">
                        {entry.cost.toFixed(2)}€
                      </div>
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeMaterialEntry(idx)} className="col-span-1 h-6 w-6">
                        <X className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <div className="text-right text-sm font-bold text-orange-700 pt-1 border-t">
                    Subtotal: {materialsSubtotal.toFixed(2)}€
                  </div>
                </div>
              )}
            </div>

            {(laborEntries.length > 0 || materialEntries.length > 0) && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">TOTAL</span>
                  <span className="text-lg font-bold text-primary">{total.toFixed(2)}€</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <FormLabel>Fotos Antes</FormLabel>
              <div className="flex flex-wrap gap-2">
                {photosBefore.map((path, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto("before", idx)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      data-testid={`button-remove-before-photo-${idx}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => beforeInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50"
                  data-testid="button-upload-before-photo"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5 text-muted-foreground" />}
                </button>
                <input
                  ref={beforeInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0], "before")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <FormLabel>Fotos Depois</FormLabel>
              <div className="flex flex-wrap gap-2">
                {photosAfter.map((path, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto("after", idx)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      data-testid={`button-remove-after-photo-${idx}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => afterInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50"
                  data-testid="button-upload-after-photo"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5 text-muted-foreground" />}
                </button>
                <input
                  ref={afterInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0], "after")}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full btn-primary" disabled={createLog.isPending || isUploading}>
              {createLog.isPending ? "A guardar..." : "Guardar Registo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AddAppointmentDialog({ clientId }: { clientId: number }) {
  const [open, setOpen] = useState(false);
  const createApt = useCreateAppointment();
  
  const form = useForm<z.infer<typeof insertAppointmentSchema>>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      clientId,
      type: "Garden",
      notes: "",
      date: new Date(),
    }
  });

  const onSubmit = async (values: z.infer<typeof insertAppointmentSchema>) => {
    try {
      await createApt.mutateAsync(values);
      setOpen(false);
      form.reset();
    } catch (e) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 rounded-lg">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      // Simple workaround for datetime-local needing ISO string without seconds/Z
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      // value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
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
                      <SelectTrigger className="rounded-xl">
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full btn-primary" disabled={createApt.isPending}>
              {createApt.isPending ? "A agendar..." : "Agendar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const updateClient = useUpdateClient();
  
  const form = useForm<z.infer<typeof insertClientSchema>>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone || "",
      whatsapp: client.whatsapp || "",
      facebookMessenger: client.facebookMessenger || "",
      address: client.address || "",
      latitude: client.latitude || undefined,
      longitude: client.longitude || undefined,
      hasGarden: client.hasGarden ?? false,
      hasPool: client.hasPool ?? false,
      hasJacuzzi: client.hasJacuzzi ?? false,
      gardenVisitFrequency: client.gardenVisitFrequency || "seasonal",
      billingType: client.billingType || "monthly",
      monthlyRate: client.monthlyRate || undefined,
      hourlyRate: client.hourlyRate || undefined,
      poolLength: client.poolLength || undefined,
      poolWidth: client.poolWidth || undefined,
      poolMinDepth: client.poolMinDepth || undefined,
      poolMaxDepth: client.poolMaxDepth || undefined,
      jacuzziLength: client.jacuzziLength || undefined,
      jacuzziWidth: client.jacuzziWidth || undefined,
      jacuzziDepth: client.jacuzziDepth || undefined,
      serviceDurationMinutes: client.serviceDurationMinutes ?? 60,
    }
  });

  const billingType = form.watch("billingType");
  const hasGarden = form.watch("hasGarden");
  const hasPool = form.watch("hasPool");
  const hasJacuzzi = form.watch("hasJacuzzi");

  const onSubmit = async (values: z.infer<typeof insertClientSchema>) => {
    try {
      await updateClient.mutateAsync({ 
        id: client.id, 
        ...values,
        latitude: values.latitude ?? client.latitude,
        longitude: values.longitude ?? client.longitude,
      });
      setOpen(false);
    } catch (e) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-primary-foreground/80 hover:text-white hover:bg-white/10" data-testid="button-edit-client">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" className="rounded-xl" data-testid="input-client-name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="912 345 678" className="rounded-xl" data-testid="input-client-phone" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp (se diferente do telefone)</FormLabel>
                  <FormControl>
                    <Input placeholder="+351 912 345 678" className="rounded-xl" data-testid="input-client-whatsapp" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookMessenger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Messenger (username)</FormLabel>
                  <FormControl>
                    <Input placeholder="username ou ID" className="rounded-xl" data-testid="input-client-messenger" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morada</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Rua, número, localidade..." className="rounded-xl" data-testid="input-client-address" {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Serviços</FormLabel>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="hasGarden"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value ?? false} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-has-garden"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 flex items-center gap-1 text-sm font-normal">
                        <Leaf className="w-4 h-4 text-green-600" /> Jardim
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasPool"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value ?? false} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-has-pool"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 flex items-center gap-1 text-sm font-normal">
                        <Waves className="w-4 h-4 text-blue-600" /> Piscina
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasJacuzzi"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value ?? false} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-has-jacuzzi"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 flex items-center gap-1 text-sm font-normal">
                        <ThermometerSun className="w-4 h-4 text-orange-600" /> Jacuzzi
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {hasGarden && (
              <div className="space-y-3 p-3 rounded-xl border bg-green-50/50">
                <FormLabel className="flex items-center gap-2 text-green-700">
                  <Leaf className="w-4 h-4" />
                  Frequência de Visitas (Jardim)
                </FormLabel>
                <FormField
                  control={form.control}
                  name="gardenVisitFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value || "seasonal"}
                          className="grid grid-cols-1 gap-2"
                        >
                          <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'seasonal' ? 'border-green-500 bg-green-100/50' : 'bg-background/50'}`}>
                            <RadioGroupItem value="seasonal" id="edit-seasonal" className="mt-0.5" />
                            <Label htmlFor="edit-seasonal" className="flex flex-col cursor-pointer">
                              <span className="text-sm font-medium">Sazonal (padrão)</span>
                              <span className="text-xs text-muted-foreground">Época alta: 2x/mês | Época baixa: 1x/mês</span>
                            </Label>
                          </div>
                          <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'once_monthly' ? 'border-green-500 bg-green-100/50' : 'bg-background/50'}`}>
                            <RadioGroupItem value="once_monthly" id="edit-once_monthly" className="mt-0.5" />
                            <Label htmlFor="edit-once_monthly" className="flex flex-col cursor-pointer">
                              <span className="text-sm font-medium">Acordo Especial</span>
                              <span className="text-xs text-muted-foreground">1 visita por mês durante todo o ano</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {hasPool && (
              <div className="space-y-3 p-3 rounded-xl border bg-blue-50/50">
                <FormLabel className="flex items-center gap-2 text-blue-700">
                  <Waves className="w-4 h-4" />
                  Dimensões da Piscina (metros)
                </FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="poolLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Comp.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="10.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poolWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Larg.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="5.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="poolMinDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prof. Mín.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="1.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poolMaxDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prof. Máx.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("poolLength") && form.watch("poolWidth") && form.watch("poolMinDepth") && form.watch("poolMaxDepth") && (
                  <div className="text-sm text-blue-700 font-medium">
                    Volume: {((form.watch("poolLength") || 0) * (form.watch("poolWidth") || 0) * ((form.watch("poolMinDepth") || 0) + (form.watch("poolMaxDepth") || 0)) / 2).toFixed(1)} m³
                  </div>
                )}
              </div>
            )}

            {hasJacuzzi && (
              <div className="space-y-3 p-3 rounded-xl border bg-orange-50/50">
                <FormLabel className="flex items-center gap-2 text-orange-700">
                  <ThermometerSun className="w-4 h-4" />
                  Dimensões do Jacuzzi (metros)
                </FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="jacuzziLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Comp.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jacuzziWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Larg.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jacuzziDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prof.</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0.8" 
                            className="rounded-xl"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("jacuzziLength") && form.watch("jacuzziWidth") && form.watch("jacuzziDepth") && (
                  <div className="text-sm text-orange-700 font-medium">
                    Volume: {((form.watch("jacuzziLength") || 0) * (form.watch("jacuzziWidth") || 0) * (form.watch("jacuzziDepth") || 0)).toFixed(1)} m³
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 p-3 rounded-xl border bg-muted/30">
              <FormLabel className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Duração Estimada do Serviço
              </FormLabel>
              <FormField
                control={form.control}
                name="serviceDurationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="15"
                          step="15"
                          placeholder="60" 
                          className="rounded-xl w-24"
                          data-testid="input-edit-service-duration"
                          {...field}
                          value={field.value ?? 60}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 60)}
                        />
                        <span className="text-sm text-muted-foreground">minutos</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tempo médio para realizar todos os serviços
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormLabel>Tipo de Faturação</FormLabel>
              <FormField
                control={form.control}
                name="billingType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || "monthly"}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div className={`flex items-center space-x-2 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'monthly' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                          <RadioGroupItem value="monthly" id="edit-monthly" />
                          <Label htmlFor="edit-monthly" className="flex items-center gap-2 cursor-pointer">
                            <Euro className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Mensal</span>
                          </Label>
                        </div>
                        <div className={`flex items-center space-x-2 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'hourly' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                          <RadioGroupItem value="hourly" id="edit-hourly" />
                          <Label htmlFor="edit-hourly" className="flex items-center gap-2 cursor-pointer">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">À Hora</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {billingType === "monthly" && (
                <FormField
                  control={form.control}
                  name="monthlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mensal (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="rounded-xl"
                          data-testid="input-edit-monthly-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              {billingType === "hourly" && (
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor por Hora (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="rounded-xl"
                          data-testid="input-edit-hourly-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <Button type="submit" className="w-full btn-primary" disabled={updateClient.isPending}>
              {updateClient.isPending ? "A guardar..." : "Guardar Alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const completeVisitFormSchema = z.object({
  actualDurationMinutes: z.number().min(5, "Mínimo 5 minutos").max(600, "Máximo 10 horas"),
  workerCount: z.number().min(1, "Mínimo 1 trabalhador").max(10, "Máximo 10 trabalhadores"),
  notes: z.string().optional(),
  includeGarden: z.boolean().default(false),
  includePool: z.boolean().default(false),
  includeJacuzzi: z.boolean().default(false),
});

function CompleteVisitDialog({ 
  clientId, 
  appointmentId, 
  appointmentType,
  estimatedDuration 
}: { 
  clientId: number; 
  appointmentId: number;
  appointmentType: string;
  estimatedDuration: number;
}) {
  const [open, setOpen] = useState(false);
  const createServiceVisit = useCreateServiceVisit();
  const updateAppointment = useUpdateAppointment();
  const { data: client } = useClient(clientId);

  const form = useForm<z.infer<typeof completeVisitFormSchema>>({
    resolver: zodResolver(completeVisitFormSchema),
    defaultValues: {
      actualDurationMinutes: estimatedDuration,
      workerCount: 1,
      notes: "",
      includeGarden: appointmentType === "Garden",
      includePool: appointmentType === "Pool",
      includeJacuzzi: appointmentType === "Jacuzzi",
    },
  });

  async function onSubmit(values: z.infer<typeof completeVisitFormSchema>) {
    try {
      const services: { serviceType: string; wasPlanned: boolean }[] = [];
      if (values.includeGarden) services.push({ serviceType: "Garden", wasPlanned: appointmentType === "Garden" });
      if (values.includePool) services.push({ serviceType: "Pool", wasPlanned: appointmentType === "Pool" });
      if (values.includeJacuzzi) services.push({ serviceType: "Jacuzzi", wasPlanned: appointmentType === "Jacuzzi" });

      if (services.length === 0) {
        services.push({ serviceType: appointmentType, wasPlanned: true });
      }

      await createServiceVisit.mutateAsync({
        visit: {
          clientId,
          visitDate: new Date(),
          actualDurationMinutes: values.actualDurationMinutes,
          workerCount: values.workerCount,
          notes: values.notes,
        },
        services,
      });

      await updateAppointment.mutateAsync({
        id: appointmentId,
        isCompleted: true,
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="shrink-0" data-testid={`button-complete-visit-${appointmentId}`}>
          <Check className="w-5 h-5 text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-primary">Confirmar Visita</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="actualDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Duração Real
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        min="5"
                        step="5"
                        className="rounded-xl w-24"
                        data-testid="input-actual-duration"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                      <span className="text-sm text-muted-foreground">minutos</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Nº de Trabalhadores
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      max="10"
                      className="rounded-xl w-24"
                      data-testid="input-worker-count"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Serviços Realizados</FormLabel>
              <div className="flex flex-wrap gap-3">
                {client?.hasGarden && (
                  <FormField
                    control={form.control}
                    name="includeGarden"
                    render={({ field }) => (
                      <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${field.value ? 'bg-green-50 border-green-300' : 'bg-background'}`}>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-include-garden"
                        />
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Jardim</span>
                      </label>
                    )}
                  />
                )}
                {client?.hasPool && (
                  <FormField
                    control={form.control}
                    name="includePool"
                    render={({ field }) => (
                      <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${field.value ? 'bg-blue-50 border-blue-300' : 'bg-background'}`}>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-include-pool"
                        />
                        <Waves className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Piscina</span>
                      </label>
                    )}
                  />
                )}
                {client?.hasJacuzzi && (
                  <FormField
                    control={form.control}
                    name="includeJacuzzi"
                    render={({ field }) => (
                      <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${field.value ? 'bg-orange-50 border-orange-300' : 'bg-background'}`}>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-include-jacuzzi"
                        />
                        <ThermometerSun className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Jacuzzi</span>
                      </label>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre a visita..."
                      className="rounded-xl resize-none"
                      data-testid="input-visit-notes"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={createServiceVisit.isPending}
              data-testid="button-submit-visit"
            >
              {createServiceVisit.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A registar...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Visita
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface TimelineEvent {
  id: string;
  date: Date;
  type: "service" | "appointment" | "photo";
  title: string;
  description?: string;
  serviceType?: string;
  photos?: string[];
  isCompleted?: boolean;
}

function ClientTimeline({ 
  logs, 
  appointments, 
  quickPhotos 
}: { 
  logs: ServiceLog[]; 
  appointments: Appointment[];
  quickPhotos: QuickPhoto[];
}) {
  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = [];

    logs.forEach((log) => {
      const photos = [
        ...(log.photosBefore || []),
        ...(log.photosAfter || []),
      ];
      allEvents.push({
        id: `log-${log.id}`,
        date: new Date(log.date),
        type: "service",
        title: log.type === "Garden" ? "Serviço de Jardim" : 
               log.type === "Pool" ? "Serviço de Piscina" : 
               log.type === "Jacuzzi" ? "Serviço de Jacuzzi" : "Serviço Geral",
        description: log.description || undefined,
        serviceType: log.type,
        photos: photos.length > 0 ? photos : undefined,
        isCompleted: true,
      });
    });

    appointments.forEach((apt) => {
      allEvents.push({
        id: `apt-${apt.id}`,
        date: new Date(apt.date),
        type: "appointment",
        title: apt.type === "Garden" ? "Agendamento Jardim" : 
               apt.type === "Pool" ? "Agendamento Piscina" : 
               apt.type === "Jacuzzi" ? "Agendamento Jacuzzi" : "Agendamento",
        description: apt.notes || undefined,
        serviceType: apt.type,
        isCompleted: apt.isCompleted || false,
      });
    });

    quickPhotos.forEach((photo) => {
      allEvents.push({
        id: `photo-${photo.id}`,
        date: new Date(photo.createdAt!),
        type: "photo",
        title: "Captura Rápida",
        description: photo.notes || undefined,
        serviceType: photo.serviceType || "Geral",
        photos: [photo.photoUrl],
      });
    });

    return allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [logs, appointments, quickPhotos]);

  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, TimelineEvent[]> = {};
    events.forEach((event) => {
      const monthKey = format(event.date, "yyyy-MM");
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a));
  }, [events]);

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case "service":
        return <CheckCircle2 className="w-4 h-4" />;
      case "appointment":
        return event.isCompleted 
          ? <CheckCircle2 className="w-4 h-4" /> 
          : <Calendar className="w-4 h-4" />;
      case "photo":
        return <Camera className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === "photo") return "bg-pink-500";
    switch (event.serviceType) {
      case "Garden": return "bg-green-500";
      case "Pool": return "bg-blue-500";
      case "Jacuzzi": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getEventBadgeClass = (event: TimelineEvent) => {
    if (event.type === "photo") return "bg-pink-100 text-pink-700 border-pink-200";
    switch (event.serviceType) {
      case "Garden": return "bg-green-100 text-green-700 border-green-200";
      case "Pool": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Jacuzzi": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Ainda sem histórico para este cliente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Timeline do Cliente</h3>
      
      {eventsByMonth.map(([monthKey, monthEvents]) => {
        const [year, month] = monthKey.split("-");
        const monthDate = new Date(parseInt(year), parseInt(month) - 1);
        const monthLabel = format(monthDate, "MMMM yyyy", { locale: pt });

        return (
          <div key={monthKey} className="relative">
            <div className="sticky top-0 z-10 bg-background py-2">
              <Badge variant="outline" className="text-xs font-semibold capitalize">
                {monthLabel}
              </Badge>
            </div>

            <div className="relative ml-4 border-l-2 border-muted pl-6 space-y-4 pb-4">
              {monthEvents.map((event, idx) => (
                <div 
                  key={event.id} 
                  className="relative"
                  data-testid={`timeline-event-${event.id}`}
                >
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full ${getEventColor(event)} flex items-center justify-center text-white`}>
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </div>

                  <div className="bg-card border border-border/50 rounded-xl p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getEventBadgeClass(event)}`}>
                          {getEventIcon(event)}
                        </div>
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(event.date, "d MMM, HH:mm", { locale: pt })}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {event.photos && event.photos.length > 0 && (
                      <div className="flex gap-1 mt-2 overflow-x-auto">
                        {event.photos.slice(0, 4).map((photo, photoIdx) => (
                          <img
                            key={photoIdx}
                            src={photo}
                            alt={`Foto ${photoIdx + 1}`}
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                        ))}
                        {event.photos.length > 4 && (
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-xs text-muted-foreground">+{event.photos.length - 4}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {event.type === "appointment" && !event.isCompleted && (
                      <Badge variant="outline" className="mt-2 text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
