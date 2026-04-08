import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertClientSchema } from "@shared/schema";
import { useCreateClient } from "@/hooks/use-clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPicker } from "@/components/MapPicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Leaf, Waves, ThermometerSun, Euro, Clock, Banknote, Building2, Smartphone, CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DurationInput } from "@/components/DurationInput";

// Form schema extending the insert schema with validation
const formSchema = insertClientSchema.extend({
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(3, "O telefone é demasiado curto").optional().or(z.literal("")),
});

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const createClient = useCreateClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      hasGarden: false,
      hasPool: false,
      hasJacuzzi: false,
      gardenVisitFrequency: "seasonal",
      poolVisitFrequency: "seasonal",
      jacuzziVisitFrequency: "seasonal",
      latitude: undefined,
      longitude: undefined,
      billingType: "monthly",
      monthlyRate: undefined,
      hourlyRate: undefined,
      paymentMethod: undefined,
      scheduledTransferDay: undefined,
      poolLength: undefined,
      poolWidth: undefined,
      poolMinDepth: undefined,
      poolMaxDepth: undefined,
      jacuzziLength: undefined,
      jacuzziWidth: undefined,
      jacuzziDepth: undefined,
      serviceDurationMinutes: 60,
    },
  });

  const billingType = form.watch("billingType");
  const hasGarden = form.watch("hasGarden");
  const hasPool = form.watch("hasPool");
  const hasJacuzzi = form.watch("hasJacuzzi");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createClient.mutateAsync(values as any); // Cast for strict type matching on optional fields
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary">Adicionar Novo Cliente</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morada</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Rua das Flores, 123..." {...field} value={field.value ?? ""} className="rounded-xl min-h-[60px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Localização no Mapa</FormLabel>
              <MapPicker
                latitude={form.watch("latitude")}
                longitude={form.watch("longitude")}
                onChange={(lat, lng) => {
                  form.setValue("latitude", lat);
                  form.setValue("longitude", lng);
                }}
              />
            </div>

            <div className="space-y-3 pt-2">
              <FormLabel>Serviços Necessários</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="hasGarden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3 shadow-sm bg-background/50">
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium">Jardim</span>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasPool"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3 shadow-sm bg-background/50">
                      <div className="flex items-center space-x-2">
                        <Waves className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">Piscina</span>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasJacuzzi"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3 shadow-sm bg-background/50">
                      <div className="flex items-center space-x-2">
                        <ThermometerSun className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium">Jacuzzi</span>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {hasGarden && (
              <div className="space-y-3 pt-2 p-3 rounded-xl border bg-green-50/50">
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
                            <RadioGroupItem value="seasonal" id="seasonal" className="mt-0.5" />
                            <Label htmlFor="seasonal" className="flex flex-col cursor-pointer">
                              <span className="text-sm font-medium">Sazonal (padrão)</span>
                              <span className="text-xs text-muted-foreground">Época alta: 2x/mês | Época baixa: 1x/mês</span>
                            </Label>
                          </div>
                          <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'once_monthly' ? 'border-green-500 bg-green-100/50' : 'bg-background/50'}`}>
                            <RadioGroupItem value="once_monthly" id="garden_once_monthly" className="mt-0.5" />
                            <Label htmlFor="garden_once_monthly" className="flex flex-col cursor-pointer">
                              <span className="text-sm font-medium">Acordo Especial</span>
                              <span className="text-xs text-muted-foreground">1 visita por mês durante todo o ano</span>
                            </Label>
                          </div>
                          <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'on_demand' ? 'border-green-500 bg-green-100/50' : 'bg-background/50'}`}>
                            <RadioGroupItem value="on_demand" id="garden_on_demand" className="mt-0.5" />
                            <Label htmlFor="garden_on_demand" className="flex flex-col cursor-pointer">
                              <span className="text-sm font-medium">Quando Necessário</span>
                              <span className="text-xs text-muted-foreground">Sem acordo fixo - serviço a pedido</span>
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
              <div className="space-y-3 pt-2 p-3 rounded-xl border bg-blue-50/50">
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
                        <FormLabel className="text-xs">Comprimento</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="10.0" 
                            className="rounded-xl"
                            data-testid="input-pool-length"
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
                        <FormLabel className="text-xs">Largura</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="5.0" 
                            className="rounded-xl"
                            data-testid="input-pool-width"
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
                        <FormLabel className="text-xs">Prof. Mínima</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="1.0" 
                            className="rounded-xl"
                            data-testid="input-pool-min-depth"
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
                        <FormLabel className="text-xs">Prof. Máxima</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            data-testid="input-pool-max-depth"
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
                  <div className="text-sm text-blue-700 font-medium mt-2">
                    Volume: {((form.watch("poolLength") || 0) * (form.watch("poolWidth") || 0) * ((form.watch("poolMinDepth") || 0) + (form.watch("poolMaxDepth") || 0)) / 2).toFixed(1)} m³
                  </div>
                )}
                
                <div className="pt-3 border-t border-blue-200">
                  <FormLabel className="flex items-center gap-2 text-blue-700 mb-2">
                    <CalendarDays className="w-4 h-4" />
                    Frequência de Visitas
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="poolVisitFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value || "seasonal"}
                            className="grid grid-cols-1 gap-2"
                          >
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'seasonal' ? 'border-blue-500 bg-blue-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="seasonal" id="pool_seasonal" className="mt-0.5" />
                              <Label htmlFor="pool_seasonal" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Sazonal (padrão)</span>
                                <span className="text-xs text-muted-foreground">Época alta: 1x/semana | Época baixa: 2x/mês</span>
                              </Label>
                            </div>
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'once_monthly' ? 'border-blue-500 bg-blue-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="once_monthly" id="pool_once_monthly" className="mt-0.5" />
                              <Label htmlFor="pool_once_monthly" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Acordo Especial</span>
                                <span className="text-xs text-muted-foreground">1 visita por mês durante todo o ano</span>
                              </Label>
                            </div>
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'on_demand' ? 'border-blue-500 bg-blue-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="on_demand" id="pool_on_demand" className="mt-0.5" />
                              <Label htmlFor="pool_on_demand" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Quando Necessário</span>
                                <span className="text-xs text-muted-foreground">Sem acordo fixo - serviço a pedido</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {hasJacuzzi && (
              <div className="space-y-3 pt-2 p-3 rounded-xl border bg-orange-50/50">
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
                        <FormLabel className="text-xs">Comprimento</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            data-testid="input-jacuzzi-length"
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
                        <FormLabel className="text-xs">Largura</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="2.0" 
                            className="rounded-xl"
                            data-testid="input-jacuzzi-width"
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
                        <FormLabel className="text-xs">Profundidade</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0.8" 
                            className="rounded-xl"
                            data-testid="input-jacuzzi-depth"
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
                  <div className="text-sm text-orange-700 font-medium mt-2">
                    Volume: {((form.watch("jacuzziLength") || 0) * (form.watch("jacuzziWidth") || 0) * (form.watch("jacuzziDepth") || 0)).toFixed(1)} m³
                  </div>
                )}
                
                <div className="pt-3 border-t border-orange-200">
                  <FormLabel className="flex items-center gap-2 text-orange-700 mb-2">
                    <CalendarDays className="w-4 h-4" />
                    Frequência de Visitas
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="jacuzziVisitFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value || "seasonal"}
                            className="grid grid-cols-1 gap-2"
                          >
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'seasonal' ? 'border-orange-500 bg-orange-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="seasonal" id="jacuzzi_seasonal" className="mt-0.5" />
                              <Label htmlFor="jacuzzi_seasonal" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Sazonal (padrão)</span>
                                <span className="text-xs text-muted-foreground">Época alta: 1x/semana | Época baixa: 2x/mês</span>
                              </Label>
                            </div>
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'once_monthly' ? 'border-orange-500 bg-orange-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="once_monthly" id="jacuzzi_once_monthly" className="mt-0.5" />
                              <Label htmlFor="jacuzzi_once_monthly" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Acordo Especial</span>
                                <span className="text-xs text-muted-foreground">1 visita por mês durante todo o ano</span>
                              </Label>
                            </div>
                            <div className={`flex items-start space-x-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'on_demand' ? 'border-orange-500 bg-orange-100/50' : 'bg-background/50'}`}>
                              <RadioGroupItem value="on_demand" id="jacuzzi_on_demand" className="mt-0.5" />
                              <Label htmlFor="jacuzzi_on_demand" className="flex flex-col cursor-pointer">
                                <span className="text-sm font-medium">Quando Necessário</span>
                                <span className="text-xs text-muted-foreground">Sem acordo fixo - serviço a pedido</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 p-3 rounded-xl border bg-muted/30">
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
                      <DurationInput
                        value={field.value ?? 60}
                        onChange={field.onChange}
                        data-testid="input-service-duration"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tempo médio para realizar todos os serviços neste cliente
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 pt-2">
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
                        className="grid grid-cols-3 gap-3"
                      >
                        <div className={`flex items-center space-x-2 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'monthly' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="flex items-center gap-2 cursor-pointer">
                            <Euro className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Mensal</span>
                          </Label>
                        </div>
                        <div className={`flex items-center space-x-2 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'hourly' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly" className="flex items-center gap-2 cursor-pointer">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">À Hora</span>
                          </Label>
                        </div>
                        <div className={`flex items-center space-x-2 rounded-xl border p-3 shadow-sm cursor-pointer transition-colors ${field.value === 'per_visit' ? 'border-primary bg-primary/5' : 'bg-background/50'}`}>
                          <RadioGroupItem value="per_visit" id="per_visit" />
                          <Label htmlFor="per_visit" className="flex items-center gap-2 cursor-pointer">
                            <CalendarDays className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium">Por Visita</span>
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
                          data-testid="input-monthly-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
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
                          data-testid="input-hourly-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {billingType === "per_visit" && (
                <FormField
                  control={form.control}
                  name="perVisitRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor por Visita (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="rounded-xl"
                          data-testid="input-per-visit-rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-3 pt-2 p-3 rounded-xl border bg-muted/30">
              <FormLabel className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Método de Pagamento
              </FormLabel>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl" data-testid="select-payment-method">
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600" />
                            Dinheiro
                          </div>
                        </SelectItem>
                        <SelectItem value="bank_transfer">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            Transferência Bancária
                          </div>
                        </SelectItem>
                        <SelectItem value="mbway">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-red-500" />
                            MBway
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {form.watch("paymentMethod") === "bank_transfer" && (
                <FormField
                  control={form.control}
                  name="scheduledTransferDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4" />
                        Dia da Transferência Agendada
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Dia</span>
                          <Input 
                            type="number" 
                            min="1"
                            max="31"
                            placeholder="15" 
                            className="rounded-xl w-20"
                            data-testid="input-scheduled-transfer-day"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                          <span className="text-sm text-muted-foreground">de cada mês</span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Opcional - indica quando o cliente costuma fazer a transferência
                      </p>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Iniciais</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Código do portão, animais, etc." {...field} value={field.value ?? ""} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full btn-primary" disabled={createClient.isPending}>
                {createClient.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A criar...
                  </>
                ) : (
                  "Criar Cliente"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
