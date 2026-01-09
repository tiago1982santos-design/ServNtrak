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
    const userId = (req.user as any).claims.sub;
    const clients = await storage.getClients(userId);
    res.json(clients);
  });

  app.get(api.clients.get.path, requireAuth, async (req, res) => {
    const client = await storage.getClient(Number(req.params.id));
    if (!client) return res.status(404).json({ message: "Client not found" });
    
    // Check ownership
    const userId = (req.user as any).claims.sub;
    if (client.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    res.json(client);
  });

  app.post(api.clients.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.clients.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any).claims.sub;
    await storage.deleteClient(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Appointments ---

  app.get(api.appointments.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
      
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any).claims.sub;
    await storage.deleteAppointment(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Service Logs ---

  app.get(api.serviceLogs.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const logs = await storage.getServiceLogs(userId, clientId);
    res.json(logs);
  });

  // Get unpaid extra services - must be before :id route
  app.get(api.serviceLogs.unpaid.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const unpaidLogs = await storage.getUnpaidExtraServices(userId);
    res.json(unpaidLogs);
  });

  app.get(api.serviceLogs.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const log = await storage.getServiceLogWithEntries(Number(req.params.id), userId);
    if (!log) return res.status(404).json({ message: "Service log not found" });
    res.json(log);
  });

  app.post(api.serviceLogs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceLogs.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
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
    const userId = (req.user as any).claims.sub;
    const updated = await storage.markServiceLogAsPaid(Number(req.params.id), userId);
    if (!updated) return res.status(404).json({ message: "Service log not found" });
    res.json(updated);
  });

  app.delete(api.serviceLogs.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    await storage.deleteServiceLog(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Reminders ---

  app.get(api.reminders.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
      
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any).claims.sub;
    await storage.deleteReminder(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Quick Photos ---

  app.get(api.quickPhotos.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
      
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
    const userId = (req.user as any).claims.sub;
    await storage.deleteQuickPhoto(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchase Categories ---

  app.get(api.purchaseCategories.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    // Initialize default categories if needed
    await storage.initializeDefaultCategories(userId);
    const categories = await storage.getPurchaseCategories(userId);
    res.json(categories);
  });

  app.post(api.purchaseCategories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchaseCategories.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any).claims.sub;
    await storage.deletePurchaseCategory(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Stores ---

  app.get(api.stores.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const storesList = await storage.getStores(userId);
    res.json(storesList);
  });

  app.get(api.stores.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const store = await storage.getStore(Number(req.params.id), userId);
    if (!store) return res.status(404).json({ message: "Loja não encontrada" });
    res.json(store);
  });

  app.post(api.stores.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.stores.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any).claims.sub;
    await storage.deleteStore(Number(req.params.id), userId);
    res.status(204).end();
  });

  // --- Purchases ---

  app.get(api.purchases.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const purchasesList = await storage.getPurchases(userId, categoryId, storeId);
    res.json(purchasesList);
  });

  app.post(api.purchases.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
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
      throw err;
    }
  });

  app.put(api.purchases.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.purchases.update.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
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
      throw err;
    }
  });

  app.delete(api.purchases.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    await storage.deletePurchase(Number(req.params.id), userId);
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

  return httpServer;
}
