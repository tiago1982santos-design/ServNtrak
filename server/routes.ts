import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { api } from "@shared/routes";
import { z } from "zod";

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

  app.post(api.serviceLogs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.serviceLogs.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
       // Verify client belongs to user
      const client = await storage.getClient(input.clientId);
      if (!client || client.userId !== userId) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const log = await storage.createServiceLog({ ...input, userId });
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

  return httpServer;
}
