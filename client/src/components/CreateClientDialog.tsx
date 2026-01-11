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
import { Loader2, Plus, Leaf, Waves, ThermometerSun, Euro, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
      latitude: undefined,
      longitude: undefined,
      billingType: "monthly",
      monthlyRate: undefined,
      hourlyRate: undefined,
      poolLength: undefined,
      poolWidth: undefined,
      poolMinDepth: undefined,
      poolMaxDepth: undefined,
      jacuzziLength: undefined,
      jacuzziWidth: undefined,
      jacuzziDepth: undefined,
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
                    <Input placeholder="João Silva" {...field} className="rounded-xl" />
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
                      <Input placeholder="912 345 678" {...field} className="rounded-xl" />
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
                      <Input placeholder="joao@exemplo.com" {...field} className="rounded-xl" />
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
                            <RadioGroupItem value="once_monthly" id="once_monthly" className="mt-0.5" />
                            <Label htmlFor="once_monthly" className="flex flex-col cursor-pointer">
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
              </div>
            )}

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
                        className="grid grid-cols-2 gap-3"
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
