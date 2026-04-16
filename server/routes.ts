import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { api } from "@shared/routes";
import { serviceVisits, appointments } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { saveSubscription, removeSubscription, sendPushToUser, getVapidPublicKey } from "./pushService";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Object Storage for photo uploads
  registerObjectStorageRoutes(app);

  // Middleware to enforce auth for API routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // --- Clients ---

  app.get(api.clients.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clients = await storage.getClients(userId);
    res.json(clients);
  });

  app.get(api.clients.get.path, requireAuth, async (req, res) => {
    const client = await storage.getClient(Number(req.params.id));
    if (!client) return res.status(404).json({ message: "Client not found" });
    
    // Check ownership
    const userId = req.user!.id;
    if (client.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    res.json(client);
  });

  app.post(api.clients.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.clients.create.input.parse(req.body);
      const userId = req.user!.id;
      const client = await storage.createClient({ ...input, userId });
      res.status(201).json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.clients.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.clients.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateClient(Number(req.params.id), userId, input);
      
      if (!updated) return res.status(404).json({ message: "Client not found or access denied" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.clients.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteClient(Number(req.params.id), userId);
    res.status(204).end();
  });

  app.get("/api/clients/profitability", requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const data = await storage.getClientsProfitability(userId);
    res.json(data);
  });

  // --- Appointments ---

  app.get(api.appointments.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const appointments = await storage.getAppointments(userId, clientId);
    
    // For list response, we might need to fetch clients to populate 'client' field if requested
    // But for now, simple join or separate fetch. 
    // The schema return type expects { client: ... }
    // Let's manually populate for now since Drizzle relations are set up but simple select might not join automatically without query builder
    // Or we can just return the appointment and frontend fetches client map.
    // However, the route definition says: z.custom<typeof appointments.$inferSelect & { client: typeof clients.$inferSelect }>()
    
    const enrichedAppointments = await Promise.all(appointments.map(async (appt) => {
      const client = await storage.getClient(appt.clientId);
      return { ...appt, client: client! };
    }));

    res.json(enrichedAppointments);
  });

  app.post(api.appointments.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.appointments.create.input.parse(req.body);
      const userId = req.user!.id;
      
      // Verify client belongs to user
      const client = await storage.getClient(input.clientId);
      if (!client || client.userId !== userId) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const appt = await storage.createAppointment({ ...input, userId });
      res.status(201).json(appt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.appointments.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.appointments.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateAppointment(Number(req.params.id), userId, input);
      
      if (!updated) return res.status(404).json({ message: "Appointment not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.appointments.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteAppointment(Number(req.params.id), userId);
    res.status(204).end();
  });

  app.post("/api/appointments/:id/visit-response", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { confirmed } = z.object({ confirmed: z.boolean() }).parse(req.body);
      const userId = req.user!.id;

      if (confirmed) {
        await db
          .update(appointments)
          .set({ isCompleted: true })
          .where(and(eq(appointments.id, id), eq(appointments.userId, userId)));
      }

      res.json({ ok: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post("/api/appointments/generate-preview", requireAuth, async (req, res) => {
    try {
      const { year, month } = z.object({
        year: z.number().int().min(2020).max(2100),
        month: z.number().int().min(1).max(12),
      }).parse(req.body);
      const userId = req.user!.id;
      const preview = await storage.generateAppointmentPreview(userId, year, month);
      res.json(preview);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post("/api/appointments/generate-confirm", requireAuth, async (req, res) => {
    try {
      const { appointments: appts } = z.object({
        appointments: z.array(z.object({
          clientId: z.number(),
          clientName: z.string(),
          date: z.string(),
          type: z.string(),
          reason: z.string(),
        }))
      }).parse(req.body);
      const userId = req.user!.id;
      const count = await storage.confirmAppointments(userId, appts);
      res.json({ created: count });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // --- Service Logs ---

  app.get(api.serviceLogs.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const logs = await storage.getServiceLogs(userId, clientId);
    res.json(logs);
  });

  // Get unpaid extra services - must be before :id route
  app.get(api.serviceLogs.unpaid.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const unpaidLogs = await storage.getUnpaidExtraServices(userId);
    res.json(unpaidLogs);
  });

  app.get(api.serviceLogs.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const log = await storage.getServiceLogWithEntries(Number(req.params.id), userId);
    if (!log) return res.status(404).json({ message: "Service log not found" });
    res.json(log);
  });

  app.post(api.serviceLogs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceLogs.create.input.parse(req.body);
      const userId = req.user!.id;
      
      // Verify client belongs to user
      const client = await storage.getClient(input.clientId);
      if (!client || client.userId !== userId) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const { laborEntries, materialEntries, ...logData } = input;
      const log = await storage.createServiceLogWithEntries(
        { ...logData, userId },
        laborEntries || [],
        materialEntries || []
      );
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.serviceLogs.markPaid.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const updated = await storage.markServiceLogAsPaid(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Service log not found" });
    res.json(updated);
  });

  app.delete(api.serviceLogs.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteServiceLog(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Reminders ---

  app.get(api.reminders.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const remindersList = await storage.getReminders(userId, clientId);
    
    const enrichedReminders = await Promise.all(remindersList.map(async (reminder) => {
      const client = await storage.getClient(reminder.clientId);
      return { ...reminder, client: client! };
    }));

    res.json(enrichedReminders);
  });

  app.post(api.reminders.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.reminders.create.input.parse(req.body);
      const userId = req.user!.id;
      
      const client = await storage.getClient(input.clientId);
      if (!client || client.userId !== userId) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const reminder = await storage.createReminder({ ...input, userId });
      res.status(201).json(reminder);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.reminders.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.reminders.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateReminder(Number(req.params.id), userId, input);
      
      if (!updated) return res.status(404).json({ message: "Reminder not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.reminders.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteReminder(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Quick Photos ---

  app.get(api.quickPhotos.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const photos = await storage.getQuickPhotos(userId, clientId);
    
    const enrichedPhotos = await Promise.all(photos.map(async (photo) => {
      const client = await storage.getClient(photo.clientId);
      return { ...photo, client: client! };
    }));

    res.json(enrichedPhotos);
  });

  app.post(api.quickPhotos.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.quickPhotos.create.input.parse(req.body);
      const userId = req.user!.id;
      
      const client = await storage.getClient(input.clientId);
      if (!client || client.userId !== userId) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const photo = await storage.createQuickPhoto({ ...input, userId });
      res.status(201).json(photo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.quickPhotos.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteQuickPhoto(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchase Categories ---

  app.get(api.purchaseCategories.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    // Initialize default categories if needed
    await storage.initializeDefaultCategories(userId);
    const categories = await storage.getPurchaseCategories(userId);
    res.json(categories);
  });

  app.post(api.purchaseCategories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchaseCategories.create.input.parse(req.body);
      const userId = req.user!.id;
      const category = await storage.createPurchaseCategory({ ...input, userId });
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.purchaseCategories.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchaseCategories.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updatePurchaseCategory(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Categoria não encontrada" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.purchaseCategories.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deletePurchaseCategory(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Stores ---

  app.get(api.stores.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const storesList = await storage.getStores(userId);
    res.json(storesList);
  });

  app.get(api.stores.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const store = await storage.getStore(Number(req.params.id), userId);
    if (!store) return res.status(404).json({ message: "Loja não encontrada" });
    res.json(store);
  });

  app.post(api.stores.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.stores.create.input.parse(req.body);
      const userId = req.user!.id;
      const store = await storage.createStore({ ...input, userId });
      res.status(201).json(store);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.stores.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.stores.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateStore(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Loja não encontrada" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.stores.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteStore(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchases ---

  app.get(api.purchases.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const purchasesList = await storage.getPurchases(userId, categoryId, storeId);
    res.json(purchasesList);
  });

  app.post(api.purchases.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.create.input.parse(req.body);
      const userId = req.user!.id;
      
      // Verify store belongs to user
      const store = await storage.getStore(input.storeId, userId);
      if (!store) {
        return res.status(400).json({ message: "Loja inválida" });
      }

      if (input.invoiceNumber) {
        const exists = await storage.checkInvoiceExists(input.invoiceNumber, userId);
        if (exists) {
          return res.status(409).json({
            message: `A fatura ${input.invoiceNumber} já foi registada anteriormente.`,
            code: "DUPLICATE_INVOICE"
          });
        }
      }

      const purchase = await storage.createPurchase({ ...input, userId });
      res.status(201).json(purchase);
    } catch (err) {
      console.error("PURCHASE CREATE ERROR:", {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        body: req.body,
      });
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
          details: err.errors,
        });
      }
      if (err instanceof Error && err.message.includes("não autorizado")) {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).json({
        message: "Erro interno do servidor",
        detail: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.put(api.purchases.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updatePurchase(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Compra não encontrada" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      if (err instanceof Error && err.message.includes("não autorizado")) {
        return res.status(403).json({ message: err.message });
      }
      throw err;
    }
  });

  app.delete(api.purchases.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deletePurchase(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Client Payments ---

  app.get(api.clientPayments.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;
    const payments = await storage.getClientPayments(userId, year, month);
    res.json(payments);
  });

  app.post(api.clientPayments.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.clientPayments.create.input.parse(req.body);
      const userId = req.user!.id;
      const payment = await storage.createClientPayment({ ...input, userId });
      res.status(201).json(payment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.clientPayments.markPaid.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const updated = await storage.markPaymentAsPaid(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Pagamento não encontrado" });
    res.json(updated);
  });

  app.post(api.clientPayments.generate.path, requireAuth, async (req, res) => {
    try {
      const input = api.clientPayments.generate.input.parse(req.body);
      const userId = req.user!.id;
      const newPayments = await storage.generateMonthlyPayments(userId, input.year, input.month);
      res.status(201).json(newPayments);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.clientPayments.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteClientPayment(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Document Scanning for Purchases ---

  const extractedPurchaseSchema = z.object({
    storeName: z.string().optional(),
    storeNif: z.string().optional(),
    storeAddress: z.string().optional(),
    purchaseDate: z.string().optional(),
    invoiceNumber: z.string().optional().nullable(),
    items: z.array(z.object({
      productName: z.string(),
      quantity: z.number().default(1),
      unitPrice: z.number().optional(),
      totalPrice: z.number(),
      discountValue: z.number().optional(),
      finalPrice: z.number().optional(),
    })).default([]),
    totalWithoutTax: z.number().optional(),
    taxAmount: z.number().optional(),
    grandTotal: z.number().optional(),
  });

  app.post("/api/scan-document", requireAuth, async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "Imagem é obrigatória" });
      }

      // Extract base64 data and media type from data URL if present
      let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg";
      let base64Data = imageBase64;
      if (imageBase64.startsWith("data:")) {
        const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mediaType = match[1] as typeof mediaType;
          base64Data = match[2];
        }
      }

      // Call Anthropic Claude to extract text and structured data
      const response = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Você é um assistente especializado em extrair informações de documentos de compra portugueses (faturas, recibos, talões).
Analise a imagem e extraia as seguintes informações em formato JSON:
- storeName: nome da loja/fornecedor
- storeNif: NIF/Contribuinte da loja (9 dígitos)
- storeAddress: morada da loja
- purchaseDate: data da compra (formato YYYY-MM-DD)
- invoiceNumber: número da fatura ou recibo (ex: FR 2026/1234, Recibo nº 456, FT 001/00123)
- items: lista de produtos com:
  - productName: nome do produto
  - quantity: quantidade
  - unitPrice: preço unitário
  - totalPrice: valor total sem desconto
  - discountValue: valor do desconto aplicado (0 se não houver)
  - finalPrice: valor final após desconto (= totalPrice - discountValue)
- totalWithoutTax: total sem IVA
- taxAmount: valor do IVA
- grandTotal: total final com IVA

Responda APENAS com o JSON válido, sem markdown ou explicações.
Se não conseguir identificar um campo, omita-o ou use null.
Valores monetários devem ser números (ex: 12.50, não "12,50€").`,
              },
            ],
          },
        ],
      });

      const content = (response.content[0] as { type: string; text: string })?.text || "{}";
      
      // Try to parse the JSON response
      let extractedData;
      try {
        // Clean up potential markdown formatting
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        extractedData = extractedPurchaseSchema.parse(JSON.parse(cleanContent));
      } catch (parseError) {
        console.error("Failed to parse OCR response:", content);
        return res.status(422).json({ 
          message: "Não foi possível extrair informações do documento",
          rawText: content,
        });
      }

      res.json({
        success: true,
        data: extractedData,
      });
    } catch (error) {
      console.error("Error scanning document:", error);
      res.status(500).json({ message: "Erro ao processar documento" });
    }
  });

  // --- Service Visits ---

  app.get(api.serviceVisits.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const visits = await storage.getServiceVisits(userId, clientId);
    res.json(visits);
  });

  app.post(api.serviceVisits.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceVisits.create.input.parse(req.body);
      const userId = req.user!.id;
      const visit = await storage.createServiceVisit(
        { ...input.visit, userId },
        input.services
      );
      res.status(201).json(visit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.serviceVisits.stats.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = Number(req.params.id);
    const stats = await storage.getClientServiceStats(userId, clientId);
    res.json(stats);
  });

  // --- Financial Config ---

  app.get(api.financialConfig.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const config = await storage.getFinancialConfig(userId);
    res.json(config || null);
  });

  app.put(api.financialConfig.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.financialConfig.update.input.parse(req.body);
      const userId = req.user!.id;
      const config = await storage.createOrUpdateFinancialConfig(userId, input);
      res.json(config);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Monthly Distributions ---

  app.get(api.monthlyDistributions.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const distributions = await storage.getMonthlyDistributions(userId, year);
    res.json(distributions);
  });

  app.get(api.monthlyDistributions.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const year = Number(req.params.year);
    const month = Number(req.params.month);
    const distribution = await storage.getMonthlyDistribution(userId, year, month);
    res.json(distribution || null);
  });

  app.post(api.monthlyDistributions.calculate.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const year = Number(req.params.year);
    const month = Number(req.params.month);
    const distribution = await storage.calculateAndSaveDistribution(userId, year, month);
    res.json(distribution);
  });

  app.put(api.monthlyDistributions.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.monthlyDistributions.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateMonthlyDistribution(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Distribuição não encontrada" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Employees ---

  app.get(api.employees.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const includeInactive = req.query.includeInactive === 'true';
    const employeesList = await storage.getEmployees(userId, includeInactive);
    res.json(employeesList);
  });

  app.get(api.employees.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const employee = await storage.getEmployee(Number(req.params.id), userId);
    if (!employee) return res.status(404).json({ message: "Funcionário não encontrado" });
    res.json(employee);
  });

  app.post(api.employees.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const userId = req.user!.id;
      const employee = await storage.createEmployee({ ...input, userId });
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.employees.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.employees.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateEmployee(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.employees.toggleActive.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const updated = await storage.toggleEmployeeActive(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
    res.json(updated);
  });

  app.delete(api.employees.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteEmployee(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Pending Tasks ---

  app.get(api.pendingTasks.count.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const count = await storage.getPendingTasksCount(userId);
    res.json({ count });
  });

  app.get(api.pendingTasks.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const includeCompleted = req.query.includeCompleted === 'true';
    const tasks = await storage.getPendingTasks(userId, clientId, includeCompleted);
    res.json(tasks);
  });

  app.get(api.pendingTasks.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const task = await storage.getPendingTask(Number(req.params.id), userId);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(task);
  });

  app.post(api.pendingTasks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.pendingTasks.create.input.parse(req.body);
      const userId = req.user!.id;
      const task = await storage.createPendingTask({ ...input, userId });
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.pendingTasks.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.pendingTasks.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updatePendingTask(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: "Tarefa não encontrada" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.pendingTasks.complete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const serviceLogId = req.body?.serviceLogId;
    const updated = await storage.completePendingTask(Number(req.params.id), userId, serviceLogId);
    if (!updated) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(updated);
  });

  app.delete(api.pendingTasks.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deletePendingTask(Number(req.params.id), userId);
    res.status(204).end();
  });

  // Suggested Works routes
  app.get(api.suggestedWorks.list.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const includeCompleted = req.query.includeCompleted === 'true';
    const works = await storage.getSuggestedWorks(userId, clientId, includeCompleted);
    res.json(works);
  });

  app.get(api.suggestedWorks.get.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const work = await storage.getSuggestedWork(Number(req.params.id), userId);
    if (!work) return res.status(404).json({ message: 'Trabalho sugerido não encontrado' });
    res.json(work);
  });

  app.post(api.suggestedWorks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.suggestedWorks.create.input.parse(req.body);
      const userId = req.user!.id;
      const work = await storage.createSuggestedWork({ ...input, userId });
      res.status(201).json(work);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
      }
      throw e;
    }
  });

  app.put(api.suggestedWorks.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.suggestedWorks.update.input.parse(req.body);
      const userId = req.user!.id;
      const updated = await storage.updateSuggestedWork(Number(req.params.id), userId, input);
      if (!updated) return res.status(404).json({ message: 'Trabalho sugerido não encontrado' });
      res.json(updated);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
      }
      throw e;
    }
  });

  app.delete(api.suggestedWorks.delete.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    await storage.deleteSuggestedWork(Number(req.params.id), userId);
    res.status(204).end();
  });

  // ── GEOFENCING ENDPOINTS ─────────────────────────────────────────
  const verifyClientOwnership = async (clientId: number, userId: string) => {
    const userClients = await storage.getClients(userId);
    return userClients.some(c => c.id === clientId);
  };

  const geofencingArrivalSchema = z.object({
    clientId: z.number().int().positive(),
    appointmentId: z.number().int().positive().optional(),
    timestamp: z.string().datetime(),
  });

  app.post("/api/geofencing/arrival", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const parsed = geofencingArrivalSchema.parse(req.body);

      if (!(await verifyClientOwnership(parsed.clientId, userId))) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const visit = await storage.createServiceVisit(
        {
          userId,
          clientId: parsed.clientId,
          appointmentId: parsed.appointmentId,
          visitDate: new Date(parsed.timestamp),
          actualDurationMinutes: 0,
          workerCount: 1,
          source: "geofencing",
          status: "em_curso",
        },
        []
      );

      res.status(201).json(visit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
      }
      console.error("Geofencing arrival error:", err);
      res.status(500).json({ message: "Erro ao registar chegada" });
    }
  });

  const geofencingVisitSchema = z.object({
    clientId: z.number().int().positive(),
    appointmentId: z.number().int().positive().optional(),
    inicio: z.string().datetime(),
    fim: z.string().datetime(),
    duracaoMinutos: z.number().int().min(1).max(720),
    fonte: z.string().optional().default("geofencing"),
  });

  app.post("/api/geofencing/visit", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const parsed = geofencingVisitSchema.parse(req.body);

      if (!(await verifyClientOwnership(parsed.clientId, userId))) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const existingVisits = await storage.getServiceVisits(userId, parsed.clientId);
      const emCurso = existingVisits.find(
        v => v.source === "geofencing" && v.status === "em_curso" && v.clientId === parsed.clientId
      );

      let visit;
      if (emCurso) {
        const [updated] = await db.update(serviceVisits)
          .set({
            endTime: new Date(parsed.fim),
            actualDurationMinutes: parsed.duracaoMinutos,
            status: "concluida" as const,
            ...(parsed.appointmentId ? { appointmentId: parsed.appointmentId } : {}),
          })
          .where(eq(serviceVisits.id, emCurso.id))
          .returning();

        if (parsed.appointmentId) {
          await db.update(appointments)
            .set({ isCompleted: true })
            .where(and(
              eq(appointments.id, parsed.appointmentId),
              eq(appointments.userId, userId)
            ));
        }

        visit = { ...updated, services: emCurso.services ?? [] };
      } else {
        visit = await storage.createServiceVisit(
          {
            userId,
            clientId: parsed.clientId,
            appointmentId: parsed.appointmentId,
            visitDate: new Date(parsed.inicio),
            endTime: new Date(parsed.fim),
            actualDurationMinutes: parsed.duracaoMinutos,
            workerCount: 1,
            source: parsed.fonte,
            status: "concluida",
          },
          []
        );
      }

      res.json(visit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
      }
      console.error("Geofencing visit error:", err);
      res.status(500).json({ message: "Erro ao registar visita" });
    }
  });

  const geofencingDiscardSchema = z.object({
    clientId: z.number().int().positive(),
    appointmentId: z.number().int().positive().optional(),
  });

  app.post("/api/geofencing/discard", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const parsed = geofencingDiscardSchema.parse(req.body);

      const existingVisits = await storage.getServiceVisits(userId, parsed.clientId);
      const emCurso = existingVisits.find(
        v => v.source === "geofencing" && v.status === "em_curso" && v.clientId === parsed.clientId
      );

      if (emCurso) {
        await db.delete(serviceVisits).where(eq(serviceVisits.id, emCurso.id));
      }

      res.status(204).end();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
      }
      console.error("Geofencing discard error:", err);
      res.status(500).json({ message: "Erro ao descartar visita" });
    }
  });

  // --- Assistente Claude ---
  app.post("/api/assistant", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Mensagem em falta" });
      }

      // Buscar contexto do utilizador (clientes e agendamentos)
      const clients = await storage.getClients(userId);
      const appointments = await storage.getAppointments(userId);

      const systemPrompt = `És um assistente de gestão de negócio para a Peralta Gardens, uma empresa de jardinagem e manutenção de piscinas e jacuzzis em Lourinhã, Portugal. O proprietário chama-se Tiago Santos.

  Tens acesso aos seguintes dados em tempo real:
  - Clientes: ${JSON.stringify(clients.map(c => ({ id: c.id, nome: c.name, morada: c.address })))}
  - Agendamentos: ${JSON.stringify(appointments.map(a => ({ id: a.id, cliente: a.clientId, data: a.scheduledDate, servico: a.serviceType })))}

  Responde sempre em português, de forma direta e prática. Ajuda o Tiago a gerir melhor o negócio.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...history,
          { role: "user", content: message }
        ],
      });

      const reply = response.content[0].type === "text" ? response.content[0].text : "";
      res.json({ reply });

    } catch (err: any) {
      console.error("Assistente Claude error:", err);
      res.status(500).json({ message: "Erro no assistente" });
    }
  });

  // --- Push Notifications ---

  app.get("/api/push/vapid-public-key", (_req, res) => {
    res.json({ key: getVapidPublicKey() });
  });

  app.post("/api/push/subscribe", requireAuth, async (req, res) => {
    try {
      const { subscription, deviceInfo } = z.object({
        subscription: z.object({
          endpoint: z.string().url(),
          keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
          }),
        }),
        deviceInfo: z.string().optional(),
      }).parse(req.body);

      await saveSubscription(req.user!.id, subscription, deviceInfo);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Push subscribe error:", err);
      res.status(500).json({ message: "Erro ao registar notificação" });
    }
  });

  app.post("/api/push/unsubscribe", requireAuth, async (req, res) => {
    try {
      const { endpoint } = z.object({
        endpoint: z.string().url(),
      }).parse(req.body);

      await removeSubscription(endpoint, req.user!.id);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao remover notificação" });
    }
  });

  app.post("/api/push/test", requireAuth, async (req, res) => {
    try {
      const result = await sendPushToUser(req.user!.id, {
        title: "ServNtrak",
        body: "Notificações push ativas! 🌿",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        url: "/",
      });
      if (result.sent === 0) {
        return res.status(422).json({ ...result, message: "Nenhuma notificação enviada" });
      }
      res.json(result);
    } catch (err) {
      console.error("Push test error:", err);
      res.status(500).json({ message: "Erro ao enviar notificação de teste" });
    }
  });

  // ── EXPENSE NOTES ─────────────────────────────────────────

  app.get("/api/expense-notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
      const notes = await storage.getExpenseNotes(req.user!.id, clientId);
      res.json(notes);
    } catch (error) {
      console.error("Erro ao obter notas de despesa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/expense-notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const note = await storage.getExpenseNote(parseInt(req.params.id), req.user!.id);
      if (!note) return res.status(404).json({ error: "Nota não encontrada" });
      res.json(note);
    } catch (error) {
      console.error("Erro ao obter nota de despesa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/expense-notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const { items = [], ...noteData } = req.body;

      const editedWithoutReason = items.filter(
        (i: any) => i.sourceType === "edited" && !i.editReason?.trim()
      );
      if (editedWithoutReason.length > 0) {
        return res.status(400).json({
          error: "Itens editados requerem justificação (editReason).",
          items: editedWithoutReason.map((i: any) => i.description),
        });
      }

      const note = await storage.createExpenseNote(
        { ...noteData, userId: req.user!.id },
        items
      );
      res.status(201).json(note);
    } catch (error) {
      console.error("Erro ao criar nota de despesa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.patch("/api/expense-notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const updated = await storage.updateExpenseNote(
        parseInt(req.params.id),
        req.user!.id,
        req.body
      );
      if (!updated) return res.status(404).json({ error: "Nota não encontrada" });
      res.json(updated);
    } catch (error: any) {
      console.error("PATCH expense-note error:", {
        message: error?.message,
        stack: error?.stack,
        noteId: req.params.id,
        userId: req.user!.id,
        body: req.body,
      });
      if (error?.message?.includes("emitida")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.put("/api/expense-notes/:id/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const { items = [] } = req.body;

      const editedWithoutReason = items.filter(
        (i: any) => i.sourceType === "edited" && !i.editReason?.trim()
      );
      if (editedWithoutReason.length > 0) {
        return res.status(400).json({
          error: "Itens editados requerem justificação (editReason).",
          items: editedWithoutReason.map((i: any) => i.description),
        });
      }

      const updatedItems = await storage.updateExpenseNoteItems(
        parseInt(req.params.id),
        req.user!.id,
        items
      );
      res.json(updatedItems);
    } catch (error: any) {
      if (error?.message?.includes("emitida")) {
        return res.status(403).json({ error: error.message });
      }
      console.error("Erro ao actualizar itens:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/expense-notes/:id/edits", async (req, res) => {
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "Não autenticado" });
    try {
      const { fieldChanged, reason } = req.body;
      if (!fieldChanged || !reason?.trim()) {
        return res.status(400).json({
          error: "fieldChanged e reason são obrigatórios",
        });
      }
      await storage.createExpenseNoteEdit(
        parseInt(req.params.id),
        req.user!.id,
        fieldChanged,
        reason
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Erro ao criar edit:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.delete("/api/expense-notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      await storage.deleteExpenseNote(parseInt(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao apagar nota de despesa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/expense-notes/:id/pdf", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const note = await storage.getExpenseNote(parseInt(req.params.id), req.user!.id);
      if (!note) return res.status(404).json({ error: "Nota não encontrada" });
      res.json(note);
    } catch (error) {
      console.error("Erro ao obter nota para PDF:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/expense-notes/from-service-log/:logId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const logId = parseInt(req.params.logId);
      const log = await storage.getServiceLogWithEntries(logId, req.user!.id);
      if (!log) return res.status(404).json({ error: "Registo de serviço não encontrado" });

      const items: any[] = [];

      for (const entry of log.laborEntries) {
        items.push({
          description: `Mão de obra — ${entry.hours}h`,
          type: "labor",
          quantity: entry.hours,
          unitPrice: entry.hourlyRate,
          sourceType: "auto",
          editReason: null,
        });
      }

      for (const entry of log.materialEntries) {
        items.push({
          description: entry.description,
          type: "material",
          quantity: entry.quantity,
          unitPrice: entry.unitPrice,
          sourceType: "auto",
          editReason: null,
        });
      }

      if (log.billingType === "extra" && log.totalAmount && items.length === 0) {
        items.push({
          description: log.notes ?? "Serviço extra",
          type: "service",
          quantity: 1,
          unitPrice: log.totalAmount,
          sourceType: "auto",
          editReason: null,
        });
      }

      const note = await storage.createExpenseNote(
        {
          userId: req.user!.id,
          clientId: log.clientId,
          serviceLogId: logId,
          status: "draft",
          notes: req.body.notes ?? null,
        },
        items
      );
      res.status(201).json(note);
    } catch (error) {
      console.error("Erro ao criar nota a partir de serviceLog:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ── QUOTES (ORÇAMENTOS) ─────────────────────────────────────

  app.get("/api/quotes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : undefined;
      const result = await storage.getQuotes(req.user!.id, clientId);
      res.json(result);
    } catch (error) {
      console.error("Erro ao obter orçamentos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/quotes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const quote = await storage.getQuote(parseInt(req.params.id), req.user!.id);
      if (!quote) return res.status(404).json({ error: "Orçamento não encontrado" });
      res.json(quote);
    } catch (error) {
      console.error("Erro ao obter orçamento:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const { items = [], ...quoteData } = req.body;
      const quote = await storage.createQuote(
        { ...quoteData, userId: req.user!.id },
        items
      );
      res.status(201).json(quote);
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.patch("/api/quotes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const updated = await storage.updateQuote(
        parseInt(req.params.id),
        req.user!.id,
        req.body
      );
      if (!updated) return res.status(404).json({ error: "Orçamento não encontrado" });
      res.json(updated);
    } catch (error) {
      console.error("Erro ao actualizar orçamento:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.put("/api/quotes/:id/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      const { items = [] } = req.body;
      const updatedItems = await storage.updateQuoteItems(
        parseInt(req.params.id),
        req.user!.id,
        items
      );
      res.json(updatedItems);
    } catch (error) {
      console.error("Erro ao actualizar itens do orçamento:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.delete("/api/quotes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    try {
      await storage.deleteQuote(parseInt(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao apagar orçamento:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return httpServer;
}
