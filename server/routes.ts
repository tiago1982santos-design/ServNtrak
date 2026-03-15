import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
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
    const userId = (req.user as any).id;
    const clients = await storage.getClients(userId);
    res.json(clients);
  });

  app.get(api.clients.get.path, requireAuth, async (req, res) => {
    const client = await storage.getClient(Number(req.params.id));
    if (!client) return res.status(404).json({ message: "Client not found" });
    
    // Check ownership
    const userId = (req.user as any).id;
    if (client.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    res.json(client);
  });

  app.post(api.clients.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.clients.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deleteClient(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Appointments ---

  app.get(api.appointments.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
      
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deleteAppointment(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Service Logs ---

  app.get(api.serviceLogs.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const logs = await storage.getServiceLogs(userId, clientId);
    res.json(logs);
  });

  // Get unpaid extra services - must be before :id route
  app.get(api.serviceLogs.unpaid.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const unpaidLogs = await storage.getUnpaidExtraServices(userId);
    res.json(unpaidLogs);
  });

  app.get(api.serviceLogs.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const log = await storage.getServiceLogWithEntries(Number(req.params.id), userId);
    if (!log) return res.status(404).json({ message: "Service log not found" });
    res.json(log);
  });

  app.post(api.serviceLogs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceLogs.create.input.parse(req.body);
      const userId = (req.user as any).id;
      
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
    const userId = (req.user as any).id;
    const updated = await storage.markServiceLogAsPaid(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Service log not found" });
    res.json(updated);
  });

  app.delete(api.serviceLogs.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    await storage.deleteServiceLog(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Reminders ---

  app.get(api.reminders.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
      
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deleteReminder(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Quick Photos ---

  app.get(api.quickPhotos.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
      
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
    const userId = (req.user as any).id;
    await storage.deleteQuickPhoto(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchase Categories ---

  app.get(api.purchaseCategories.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    // Initialize default categories if needed
    await storage.initializeDefaultCategories(userId);
    const categories = await storage.getPurchaseCategories(userId);
    res.json(categories);
  });

  app.post(api.purchaseCategories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchaseCategories.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deletePurchaseCategory(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Stores ---

  app.get(api.stores.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const storesList = await storage.getStores(userId);
    res.json(storesList);
  });

  app.get(api.stores.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const store = await storage.getStore(Number(req.params.id), userId);
    if (!store) return res.status(404).json({ message: "Loja não encontrada" });
    res.json(store);
  });

  app.post(api.stores.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.stores.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deleteStore(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchases ---

  app.get(api.purchases.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const purchasesList = await storage.getPurchases(userId, categoryId, storeId);
    res.json(purchasesList);
  });

  app.post(api.purchases.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.create.input.parse(req.body);
      const userId = (req.user as any).id;
      
      // Verify store belongs to user
      const store = await storage.getStore(input.storeId, userId);
      if (!store) {
        return res.status(400).json({ message: "Loja inválida" });
      }

      const purchase = await storage.createPurchase({ ...input, userId });
      res.status(201).json(purchase);
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

  app.put(api.purchases.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.update.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deletePurchase(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Client Payments ---

  app.get(api.clientPayments.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;
    const payments = await storage.getClientPayments(userId, year, month);
    res.json(payments);
  });

  app.post(api.clientPayments.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.clientPayments.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const updated = await storage.markPaymentAsPaid(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Pagamento não encontrado" });
    res.json(updated);
  });

  app.post(api.clientPayments.generate.path, requireAuth, async (req, res) => {
    try {
      const input = api.clientPayments.generate.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    await storage.deleteClientPayment(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Document Scanning for Purchases ---

  const extractedPurchaseSchema = z.object({
    storeName: z.string().optional(),
    storeNif: z.string().optional(),
    storeAddress: z.string().optional(),
    purchaseDate: z.string().optional(),
    items: z.array(z.object({
      productName: z.string(),
      quantity: z.number().default(1),
      unitPrice: z.number().optional(),
      totalPrice: z.number(),
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

      // Call OpenAI Vision to extract text and structured data
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em extrair informações de documentos de compra portugueses (faturas, recibos, talões).
Analise a imagem e extraia as seguintes informações em formato JSON:
- storeName: nome da loja/fornecedor
- storeNif: NIF/Contribuinte da loja (9 dígitos)
- storeAddress: morada da loja
- purchaseDate: data da compra (formato YYYY-MM-DD)
- items: lista de produtos com productName, quantity, unitPrice, totalPrice
- totalWithoutTax: total sem IVA
- taxAmount: valor do IVA
- grandTotal: total final com IVA

Responda APENAS com o JSON válido, sem markdown ou explicações.
Se não conseguir identificar um campo, omita-o ou use null.
Valores monetários devem ser números (ex: 12.50, não "12,50€").`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: "Por favor, extrai as informações deste documento de compra.",
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || "{}";
      
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
    const userId = (req.user as any).id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const visits = await storage.getServiceVisits(userId, clientId);
    res.json(visits);
  });

  app.post(api.serviceVisits.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceVisits.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const clientId = Number(req.params.id);
    const stats = await storage.getClientServiceStats(userId, clientId);
    res.json(stats);
  });

  // --- Financial Config ---

  app.get(api.financialConfig.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const config = await storage.getFinancialConfig(userId);
    res.json(config || null);
  });

  app.put(api.financialConfig.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.financialConfig.update.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const distributions = await storage.getMonthlyDistributions(userId, year);
    res.json(distributions);
  });

  app.get(api.monthlyDistributions.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const year = Number(req.params.year);
    const month = Number(req.params.month);
    const distribution = await storage.getMonthlyDistribution(userId, year, month);
    res.json(distribution || null);
  });

  app.post(api.monthlyDistributions.calculate.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const year = Number(req.params.year);
    const month = Number(req.params.month);
    const distribution = await storage.calculateAndSaveDistribution(userId, year, month);
    res.json(distribution);
  });

  app.put(api.monthlyDistributions.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.monthlyDistributions.update.input.parse(req.body);
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const includeInactive = req.query.includeInactive === 'true';
    const employeesList = await storage.getEmployees(userId, includeInactive);
    res.json(employeesList);
  });

  app.get(api.employees.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const employee = await storage.getEmployee(Number(req.params.id), userId);
    if (!employee) return res.status(404).json({ message: "Funcionário não encontrado" });
    res.json(employee);
  });

  app.post(api.employees.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const updated = await storage.toggleEmployeeActive(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Funcionário não encontrado" });
    res.json(updated);
  });

  app.delete(api.employees.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    await storage.deleteEmployee(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Pending Tasks ---

  app.get(api.pendingTasks.count.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const count = await storage.getPendingTasksCount(userId);
    res.json({ count });
  });

  app.get(api.pendingTasks.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const includeCompleted = req.query.includeCompleted === 'true';
    const tasks = await storage.getPendingTasks(userId, clientId, includeCompleted);
    res.json(tasks);
  });

  app.get(api.pendingTasks.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const task = await storage.getPendingTask(Number(req.params.id), userId);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(task);
  });

  app.post(api.pendingTasks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.pendingTasks.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
    const serviceLogId = req.body?.serviceLogId;
    const updated = await storage.completePendingTask(Number(req.params.id), userId, serviceLogId);
    if (!updated) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(updated);
  });

  app.delete(api.pendingTasks.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    await storage.deletePendingTask(Number(req.params.id), userId);
    res.status(204).end();
  });

  // Suggested Works routes
  app.get(api.suggestedWorks.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const includeCompleted = req.query.includeCompleted === 'true';
    const works = await storage.getSuggestedWorks(userId, clientId, includeCompleted);
    res.json(works);
  });

  app.get(api.suggestedWorks.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const work = await storage.getSuggestedWork(Number(req.params.id), userId);
    if (!work) return res.status(404).json({ message: 'Trabalho sugerido não encontrado' });
    res.json(work);
  });

  app.post(api.suggestedWorks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.suggestedWorks.create.input.parse(req.body);
      const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
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
    const userId = (req.user as any).id;
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
      const userId = (req.user as any).id;
      const parsed = geofencingArrivalSchema.parse(req.body);

      if (!(await verifyClientOwnership(parsed.clientId, userId))) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const visit = await storage.createServiceVisit(
        {
          userId,
          clientId: parsed.clientId,
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
  });

  app.post("/api/geofencing/visit", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const parsed = geofencingVisitSchema.parse(req.body);

      if (!(await verifyClientOwnership(parsed.clientId, userId))) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const visit = await storage.createServiceVisit(
        {
          userId,
          clientId: parsed.clientId,
          appointmentId: parsed.appointmentId,
          visitDate: new Date(parsed.inicio),
          endTime: new Date(parsed.fim),
          actualDurationMinutes: parsed.duracaoMinutos,
          workerCount: 1,
          source: "geofencing",
          status: "concluida",
        },
        []
      );

      res.json(visit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
      }
      console.error("Geofencing visit error:", err);
      res.status(500).json({ message: "Erro ao registar visita" });
    }
  });

  return httpServer;
}
