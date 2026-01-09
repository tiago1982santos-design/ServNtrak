import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Check, X, ImagePlus, Trash2, Save, ArrowLeft, FileText } from "lucide-react";
import type { PurchaseCategory, Store } from "@shared/schema";

interface ExtractedItem {
  productName: string;
  quantity: number;
  unitPrice?: number;
  totalPrice: number;
}

interface ExtractedData {
  storeName?: string;
  storeNif?: string;
  storeAddress?: string;
  purchaseDate?: string;
  items: ExtractedItem[];
  totalWithoutTax?: number;
  taxAmount?: number;
  grandTotal?: number;
}

interface DocumentScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: PurchaseCategory[];
  stores: Store[];
}

type Step = "capture" | "processing" | "review" | "save";

export function DocumentScanDialog({ open, onOpenChange, categories, stores }: DocumentScanDialogProps) {
  const [step, setStep] = useState<Step>("capture");
  const [imageData, setImageData] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [keepPhoto, setKeepPhoto] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setStep("capture");
    setImageData(null);
    setExtractedData(null);
    setSelectedStoreId(null);
    setSelectedCategoryId(null);
    setSelectedItemIndex(0);
    setKeepPhoto(true);
  }, []);

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const scanMutation = useMutation({
    mutationFn: async (base64Image: string) => {
      const response = await apiRequest("POST", "/api/scan-document", {
        imageBase64: base64Image,
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        setExtractedData(result.data);
        
        const matchedStore = stores.find(s => 
          s.name.toLowerCase().includes(result.data.storeName?.toLowerCase() || "") ||
          s.taxId === result.data.storeNif
        );
        if (matchedStore) {
          setSelectedStoreId(matchedStore.id);
        }
        
        setStep("review");
      } else {
        toast({
          title: "Erro na extração",
          description: result.message || "Não foi possível extrair dados do documento",
          variant: "destructive",
        });
        setStep("capture");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao processar documento",
        description: error.message,
        variant: "destructive",
      });
      setStep("capture");
    },
  });

  const savePurchaseMutation = useMutation({
    mutationFn: async (data: {
      storeId: number;
      categoryId: number;
      productName: string;
      quantity: number;
      totalWithoutDiscount: number;
      discountValue: number;
      finalTotal: number;
      purchaseDate: Date;
    }) => {
      return apiRequest("POST", "/api/purchases", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/purchases')
      });
    },
  });

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageData(base64);
      setStep("processing");
      scanMutation.mutate(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    if (!selectedStoreId || !selectedCategoryId || !extractedData) {
      toast({
        title: "Dados incompletos",
        description: "Selecione uma loja e categoria antes de guardar",
        variant: "destructive",
      });
      return;
    }

    const purchaseDate = extractedData.purchaseDate 
      ? new Date(extractedData.purchaseDate) 
      : new Date();

    try {
      for (const item of extractedData.items) {
        await savePurchaseMutation.mutateAsync({
          storeId: selectedStoreId,
          categoryId: selectedCategoryId,
          productName: item.productName,
          quantity: item.quantity,
          totalWithoutDiscount: item.totalPrice,
          discountValue: 0,
          finalTotal: item.totalPrice,
          purchaseDate,
        });
      }

      toast({
        title: "Compras guardadas",
        description: `${extractedData.items.length} produto(s) adicionado(s) com sucesso`,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao guardar",
        description: "Ocorreu um erro ao guardar as compras",
        variant: "destructive",
      });
    }
  };

  const updateItem = (index: number, field: keyof ExtractedItem, value: string | number) => {
    if (!extractedData) return;
    const newItems = [...extractedData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setExtractedData({ ...extractedData, items: newItems });
  };

  const removeItem = (index: number) => {
    if (!extractedData) return;
    const newItems = extractedData.items.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, items: newItems });
    if (selectedItemIndex >= newItems.length) {
      setSelectedItemIndex(Math.max(0, newItems.length - 1));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? onOpenChange(o) : handleClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Digitalizar Documento
          </DialogTitle>
          <DialogDescription>
            {step === "capture" && "Tire uma foto do documento de compra"}
            {step === "processing" && "A processar documento..."}
            {step === "review" && "Reveja os dados extraídos"}
            {step === "save" && "Confirme as opções de guardar"}
          </DialogDescription>
        </DialogHeader>

        {step === "capture" && (
          <div className="space-y-4">
            {imageData ? (
              <div className="relative">
                <img 
                  src={imageData} 
                  alt="Documento capturado" 
                  className="w-full rounded-lg border"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImageData(null)}
                  data-testid="button-clear-image"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Card 
                className="p-12 text-center cursor-pointer hover-elevate border-dashed border-2"
                onClick={() => fileInputRef.current?.click()}
                data-testid="card-capture-area"
              >
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-foreground">Toque para tirar foto</p>
                <p className="text-sm text-muted-foreground mt-1">ou selecione uma imagem</p>
              </Card>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
              data-testid="input-file-capture"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-select-image"
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Galeria
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('capture', 'environment');
                    fileInputRef.current.click();
                  }
                }}
                data-testid="button-take-photo"
              >
                <Camera className="w-4 h-4 mr-2" />
                Câmara
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <p className="font-medium text-foreground">A analisar documento...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Isto pode demorar alguns segundos
            </p>
          </div>
        )}

        {step === "review" && extractedData && (
          <div className="space-y-4">
            {imageData && (
              <img 
                src={imageData} 
                alt="Documento" 
                className="w-full h-32 object-cover rounded-lg border"
              />
            )}

            <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
              {extractedData.storeName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loja:</span>
                  <span className="font-medium">{extractedData.storeName}</span>
                </div>
              )}
              {extractedData.storeNif && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NIF:</span>
                  <span className="font-medium">{extractedData.storeNif}</span>
                </div>
              )}
              {extractedData.purchaseDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-medium">{extractedData.purchaseDate}</span>
                </div>
              )}
              {extractedData.grandTotal && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-primary">{extractedData.grandTotal.toFixed(2)}€</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Loja</Label>
              <Select
                value={selectedStoreId?.toString() || ""}
                onValueChange={(v) => setSelectedStoreId(Number(v))}
              >
                <SelectTrigger data-testid="select-scan-store">
                  <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={selectedCategoryId?.toString() || ""}
                onValueChange={(v) => setSelectedCategoryId(Number(v))}
              >
                <SelectTrigger data-testid="select-scan-category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Produtos ({extractedData.items.length})</Label>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {extractedData.items.map((item, index) => (
                  <Card key={index} className="p-3" data-testid={`card-extracted-item-${index}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 space-y-2">
                        <Input
                          value={item.productName}
                          onChange={(e) => updateItem(index, "productName", e.target.value)}
                          placeholder="Nome do produto"
                          className="h-8 text-sm"
                          data-testid={`input-item-name-${index}`}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                            className="h-8 text-sm w-20"
                            data-testid={`input-item-qty-${index}`}
                          />
                          <Input
                            type="number"
                            step="0.01"
                            value={item.totalPrice}
                            onChange={(e) => updateItem(index, "totalPrice", Number(e.target.value))}
                            className="h-8 text-sm flex-1"
                            placeholder="Preço"
                            data-testid={`input-item-price-${index}`}
                          />
                          <span className="text-sm text-muted-foreground self-center">€</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive shrink-0"
                        onClick={() => removeItem(index)}
                        data-testid={`button-remove-item-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Guardar foto do documento?</Label>
              <div className="flex gap-2">
                <Button
                  variant={keepPhoto ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setKeepPhoto(true)}
                  data-testid="button-keep-photo"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  variant={!keepPhoto ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setKeepPhoto(false)}
                  data-testid="button-delete-photo"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={resetState}
                data-testid="button-scan-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveAll}
                disabled={!selectedStoreId || !selectedCategoryId || extractedData.items.length === 0 || savePurchaseMutation.isPending}
                data-testid="button-save-purchases"
              >
                {savePurchaseMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Guardar {extractedData.items.length} Produto(s)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
