import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  Plus, ShoppingCart, Store as StoreIcon, Tag, Loader2, ChevronRight, 
  Trash2, Edit2, MapPin, Phone, Mail, Building2, Package, Scan
} from "lucide-react";
import { DocumentScanDialog } from "@/components/DocumentScanDialog";
import type { PurchaseCategory, Store, PurchaseWithDetails, Client } from "@shared/schema";
import { User } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function Purchases() {
  const [activeTab, setActiveTab] = useState("compras");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: categories, isLoading: categoriesLoading } = useQuery<PurchaseCategory[]>({
    queryKey: ['/api/purchase-categories'],
  });

  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ['/api/stores'],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const purchasesUrl = selectedCategory 
    ? `/api/purchases?categoryId=${selectedCategory}`
    : '/api/purchases';
  
  const { data: purchases, isLoading: purchasesLoading } = useQuery<PurchaseWithDetails[]>({
    queryKey: [purchasesUrl],
  });

  const filteredPurchases = purchases || [];

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <div className="gradient-primary pt-10 pb-6 px-5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative z-10 flex items-center gap-3">
          <BackButton />
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white" data-testid="heading-purchases">Compras</h1>
            <p className="text-white/70 text-sm" data-testid="text-purchases-subtitle">Gestão de compras e stock</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="compras" data-testid="tab-purchases">
              <Package className="w-4 h-4 mr-1.5" />
              Compras
            </TabsTrigger>
            <TabsTrigger value="lojas" data-testid="tab-stores">
              <StoreIcon className="w-4 h-4 mr-1.5" />
              Lojas
            </TabsTrigger>
            <TabsTrigger value="categorias" data-testid="tab-categories">
              <Tag className="w-4 h-4 mr-1.5" />
              Categorias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compras" className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Select 
                value={selectedCategory?.toString() || "all"} 
                onValueChange={(v) => setSelectedCategory(v === "all" ? null : Number(v))}
              >
                <SelectTrigger className="w-40" data-testid="select-category-filter">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsScanDialogOpen(true)}
                  data-testid="button-scan-document"
                >
                  <Scan className="w-4 h-4 mr-1" />
                  Digitalizar
                </Button>
                <AddPurchaseDialog 
                  open={isAddPurchaseOpen} 
                  onOpenChange={setIsAddPurchaseOpen}
                  categories={categories || []}
                  stores={stores || []}
                  clients={clients || []}
                />
              </div>
            </div>

            <DocumentScanDialog
              open={isScanDialogOpen}
              onOpenChange={setIsScanDialogOpen}
              categories={categories || []}
              stores={stores || []}
            />

            {purchasesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredPurchases.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Sem compras registadas</p>
                <p className="text-sm text-muted-foreground mt-1">Adicione a sua primeira compra</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredPurchases.map((purchase) => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lojas" className="space-y-4">
            <div className="flex justify-end">
              <AddStoreDialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen} />
            </div>

            {storesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (stores?.length || 0) === 0 ? (
              <Card className="p-8 text-center">
                <StoreIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Sem lojas registadas</p>
                <p className="text-sm text-muted-foreground mt-1">Adicione a sua primeira loja</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {stores?.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categorias" className="space-y-4">
            <div className="flex justify-end">
              <AddCategoryDialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen} />
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {categories?.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}

function PurchaseCard({ purchase }: { purchase: PurchaseWithDetails }) {
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', `/api/purchases/${purchase.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) =>
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/purchases')
      });
      toast({ title: "Compra eliminada" });
    },
  });

  return (
    <>
      <Card className="p-4" data-testid={`card-purchase-${purchase.id}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate" data-testid={`text-purchase-name-${purchase.id}`}>{purchase.productName}</h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-purchase-store-${purchase.id}`}>{purchase.store.name}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{purchase.category.name}</Badge>
              <Badge variant="outline">Qtd: {purchase.quantity}</Badge>
              {purchase.client && (
                <Badge variant="default" className="bg-green-600" data-testid={`badge-client-${purchase.id}`}>
                  <User className="w-3 h-3 mr-1" />
                  {purchase.client.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className="font-bold text-lg text-primary">{purchase.finalTotal.toFixed(2)}€</p>
            {purchase.discountValue && purchase.discountValue > 0 && (
              <p className="text-xs text-green-600">-{purchase.discountValue.toFixed(2)}€ desc.</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(purchase.purchaseDate), "dd/MM/yyyy", { locale: pt })}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteOpen(true)}
            data-testid={`button-delete-purchase-${purchase.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar compra?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            "{purchase.productName}" será eliminado permanentemente.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                deleteMutation.mutate();
                setDeleteOpen(false);
              }}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StoreCard({ store }: { store: Store }) {
  const { toast } = useToast();
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', `/api/stores/${store.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      toast({ title: "Loja eliminada" });
    },
  });

  return (
    <Card className="p-4" data-testid={`card-store-${store.id}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate flex items-center gap-2" data-testid={`text-store-name-${store.id}`}>
            <Building2 className="w-4 h-4 text-primary" />
            {store.name}
          </h3>
          {store.address && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {store.address}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {store.phone && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> {store.phone}
              </span>
            )}
            {store.taxId && (
              <Badge variant="outline" className="text-xs">NIF: {store.taxId}</Badge>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive shrink-0"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          data-testid={`button-delete-store-${store.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function CategoryCard({ category }: { category: PurchaseCategory }) {
  const { toast } = useToast();
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', `/api/purchase-categories/${category.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/purchase-categories'] });
      toast({ title: "Categoria eliminada" });
    },
  });

  return (
    <Card className="p-3 flex items-center justify-between" data-testid={`card-category-${category.id}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Tag className="w-5 h-5 text-secondary-foreground" />
        </div>
        <span className="font-medium text-foreground" data-testid={`text-category-name-${category.id}`}>{category.name}</span>
        {category.isDefault && (
          <Badge variant="outline" className="text-xs">Predefinida</Badge>
        )}
      </div>
      {!category.isDefault && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          data-testid={`button-delete-category-${category.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </Card>
  );
}

const purchaseFormSchema = z.object({
  storeId: z.number({ required_error: "Selecione uma loja" }),
  categoryId: z.number({ required_error: "Selecione uma categoria" }),
  clientId: z.number().optional().nullable(),
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.number().positive("Quantidade deve ser positiva").default(1),
  totalWithoutDiscount: z.number().positive("Valor total é obrigatório"),
  discountValue: z.number().min(0).default(0),
  purchaseDate: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
});

function AddPurchaseDialog({ 
  open, 
  onOpenChange, 
  categories, 
  stores,
  clients
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  categories: PurchaseCategory[];
  stores: Store[];
  clients: Client[];
}) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      quantity: 1,
      discountValue: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof purchaseFormSchema>) => {
      const finalTotal = data.totalWithoutDiscount - (data.discountValue || 0);
      return apiRequest('POST', '/api/purchases', {
        ...data,
        purchaseDate: new Date(data.purchaseDate),
        finalTotal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/purchases')
      });
      toast({ title: "Compra adicionada com sucesso" });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar compra", description: error.message, variant: "destructive" });
    },
  });

  const totalWithoutDiscount = form.watch("totalWithoutDiscount") || 0;
  const discountValue = form.watch("discountValue") || 0;
  const finalTotal = totalWithoutDiscount - discountValue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-add-purchase">
          <Plus className="w-4 h-4 mr-1" />
          Nova Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Compra</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loja</FormLabel>
                  <Select 
                    onValueChange={(v) => field.onChange(Number(v))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-store">
                        <SelectValue placeholder="Selecione uma loja" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>{store.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={(v) => field.onChange(Number(v))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente (opcional)</FormLabel>
                  <Select 
                    onValueChange={(v) => field.onChange(v === "none" ? null : Number(v))} 
                    value={field.value?.toString() || "none"}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-client">
                        <SelectValue placeholder="Sem cliente associado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sem cliente associado</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Fertilizante NPK" data-testid="input-product-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-purchase-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalWithoutDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0.00"
                        data-testid="input-total"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0.00"
                        data-testid="input-discount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center">
              <span className="font-medium">Total Final:</span>
              <span className="text-lg font-bold text-primary">{finalTotal.toFixed(2)}€</span>
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-purchase">
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Adicionar Compra
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const storeFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  taxId: z.string().optional(),
  notes: z.string().optional(),
});

function AddStoreDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {},
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof storeFormSchema>) => 
      apiRequest('POST', '/api/stores', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      toast({ title: "Loja adicionada com sucesso" });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar loja", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-add-store">
          <Plus className="w-4 h-4 mr-1" />
          Nova Loja
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Loja</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Loja</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Leroy Merlin" data-testid="input-store-name" />
                  </FormControl>
                  <FormMessage />
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
                    <Input {...field} placeholder="Morada completa" data-testid="input-store-address" />
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
                      <Input {...field} placeholder="+351..." data-testid="input-store-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF/Contribuinte</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="999999999" data-testid="input-store-tax-id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Email" data-testid="input-store-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-store">
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Adicionar Loja
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

function AddCategoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {},
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof categoryFormSchema>) => 
      apiRequest('POST', '/api/purchase-categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/purchase-categories'] });
      toast({ title: "Categoria adicionada com sucesso" });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao adicionar categoria", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-add-category">
          <Plus className="w-4 h-4 mr-1" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Ferramentas" data-testid="input-category-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-category">
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Adicionar Categoria
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
