import { db } from "./db";
import {
  clients, appointments, serviceLogs, reminders, quickPhotos,
  serviceLogLaborEntries, serviceLogMaterialEntries,
  type InsertClient, type Client,
  type InsertAppointment, type Appointment,
  type InsertServiceLog, type ServiceLog,
  type InsertReminder, type Reminder,
  type InsertQuickPhoto, type QuickPhoto,
  type InsertServiceLogLaborEntry, type ServiceLogLaborEntry,
  type InsertServiceLogMaterialEntry, type ServiceLogMaterialEntry,
  type ServiceLogWithEntries
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Clients
  getClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient & { userId: string }): Promise<Client>;
  updateClient(id: number, userId: string, updates: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number, userId: string): Promise<void>;

  // Appointments
  getAppointments(userId: string, clientId?: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment & { userId: string }): Promise<Appointment>;
  updateAppointment(id: number, userId: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number, userId: string): Promise<void>;

  // Service Logs
  getServiceLogs(userId: string, clientId?: number): Promise<ServiceLog[]>;
  getServiceLogWithEntries(id: number, userId: string): Promise<ServiceLogWithEntries | undefined>;
  getUnpaidExtraServices(userId: string): Promise<(ServiceLog & { clientName: string })[]>;
  createServiceLogWithEntries(
    log: InsertServiceLog & { userId: string },
    laborEntries: Omit<InsertServiceLogLaborEntry, 'serviceLogId'>[],
    materialEntries: Omit<InsertServiceLogMaterialEntry, 'serviceLogId'>[]
  ): Promise<ServiceLogWithEntries>;
  updateServiceLog(id: number, userId: string, updates: Partial<InsertServiceLog>): Promise<ServiceLog | undefined>;
  markServiceLogAsPaid(id: number, userId: string): Promise<ServiceLog | undefined>;
  deleteServiceLog(id: number, userId: string): Promise<void>;

  // Reminders
  getReminders(userId: string, clientId?: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder & { userId: string }): Promise<Reminder>;
  updateReminder(id: number, userId: string, updates: Partial<InsertReminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number, userId: string): Promise<void>;

  // Quick Photos
  getQuickPhotos(userId: string, clientId?: number): Promise<QuickPhoto[]>;
  createQuickPhoto(photo: InsertQuickPhoto & { userId: string }): Promise<QuickPhoto>;
  deleteQuickPhoto(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Clients
  async getClients(userId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient & { userId: string }): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, userId: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db
      .update(clients)
      .set(updates)
      .where(and(eq(clients.id, id), eq(clients.userId, userId)))
      .returning();
    return updated;
  }

  async deleteClient(id: number, userId: string): Promise<void> {
    await db.delete(clients).where(and(eq(clients.id, id), eq(clients.userId, userId)));
  }

  // Appointments
  async getAppointments(userId: string, clientId?: number): Promise<Appointment[]> {
    const conditions = [eq(appointments.userId, userId)];
    if (clientId) conditions.push(eq(appointments.clientId, clientId));
    
    return await db
      .select()
      .from(appointments)
      .where(and(...conditions))
      .orderBy(desc(appointments.date));
  }

  async createAppointment(appointment: InsertAppointment & { userId: string }): Promise<Appointment> {
    const [newAppt] = await db.insert(appointments).values(appointment).returning();
    return newAppt;
  }

  async updateAppointment(id: number, userId: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db
      .update(appointments)
      .set(updates)
      .where(and(eq(appointments.id, id), eq(appointments.userId, userId)))
      .returning();
    return updated;
  }

  async deleteAppointment(id: number, userId: string): Promise<void> {
    await db.delete(appointments).where(and(eq(appointments.id, id), eq(appointments.userId, userId)));
  }

  // Service Logs
  async getServiceLogs(userId: string, clientId?: number): Promise<ServiceLog[]> {
    const conditions = [eq(serviceLogs.userId, userId)];
    if (clientId) conditions.push(eq(serviceLogs.clientId, clientId));
    
    return await db
      .select()
      .from(serviceLogs)
      .where(and(...conditions))
      .orderBy(desc(serviceLogs.date));
  }

  async getServiceLogWithEntries(id: number, userId: string): Promise<ServiceLogWithEntries | undefined> {
    const [log] = await db
      .select()
      .from(serviceLogs)
      .where(and(eq(serviceLogs.id, id), eq(serviceLogs.userId, userId)));
    
    if (!log) return undefined;

    const laborEntriesList = await db
      .select()
      .from(serviceLogLaborEntries)
      .where(eq(serviceLogLaborEntries.serviceLogId, id));

    const materialEntriesList = await db
      .select()
      .from(serviceLogMaterialEntries)
      .where(eq(serviceLogMaterialEntries.serviceLogId, id));

    return {
      ...log,
      laborEntries: laborEntriesList,
      materialEntries: materialEntriesList,
    };
  }

  async getUnpaidExtraServices(userId: string): Promise<(ServiceLog & { clientName: string })[]> {
    const result = await db
      .select({
        serviceLog: serviceLogs,
        clientName: clients.name,
      })
      .from(serviceLogs)
      .innerJoin(clients, eq(serviceLogs.clientId, clients.id))
      .where(and(
        eq(serviceLogs.userId, userId),
        eq(serviceLogs.billingType, 'extra'),
        eq(serviceLogs.isPaymentCollected, false)
      ))
      .orderBy(desc(serviceLogs.date));
    
    return result.map(r => ({
      ...r.serviceLog,
      clientName: r.clientName,
    }));
  }

  async createServiceLogWithEntries(
    log: InsertServiceLog & { userId: string },
    laborEntries: Omit<InsertServiceLogLaborEntry, 'serviceLogId'>[],
    materialEntries: Omit<InsertServiceLogMaterialEntry, 'serviceLogId'>[]
  ): Promise<ServiceLogWithEntries> {
    // Recalculate costs server-side for data integrity (round to 2 decimal places)
    const roundToTwo = (n: number) => Math.round(n * 100) / 100;
    
    const calculatedLaborEntries = laborEntries.map(entry => ({
      ...entry,
      cost: roundToTwo(Number(entry.hours || 0) * Number(entry.hourlyRate || 0)),
    }));
    
    const calculatedMaterialEntries = materialEntries.map(entry => ({
      ...entry,
      cost: roundToTwo(Number(entry.quantity || 0) * Number(entry.unitPrice || 0)),
    }));
    
    // Calculate subtotals from recalculated costs (rounded for consistency)
    const laborSubtotal = roundToTwo(calculatedLaborEntries.reduce((sum, entry) => sum + entry.cost, 0));
    const materialsSubtotal = roundToTwo(calculatedMaterialEntries.reduce((sum, entry) => sum + entry.cost, 0));
    const totalAmount = roundToTwo(laborSubtotal + materialsSubtotal);

    // Create service log with calculated totals
    const [newLog] = await db.insert(serviceLogs).values({
      ...log,
      laborSubtotal,
      materialsSubtotal,
      totalAmount,
    }).returning();

    // Insert labor entries with server-calculated costs
    const createdLaborEntries: ServiceLogLaborEntry[] = [];
    for (const entry of calculatedLaborEntries) {
      const [newEntry] = await db.insert(serviceLogLaborEntries).values({
        ...entry,
        serviceLogId: newLog.id,
      }).returning();
      createdLaborEntries.push(newEntry);
    }

    // Insert material entries with server-calculated costs
    const createdMaterialEntries: ServiceLogMaterialEntry[] = [];
    for (const entry of calculatedMaterialEntries) {
      const [newEntry] = await db.insert(serviceLogMaterialEntries).values({
        ...entry,
        serviceLogId: newLog.id,
      }).returning();
      createdMaterialEntries.push(newEntry);
    }

    return {
      ...newLog,
      laborEntries: createdLaborEntries,
      materialEntries: createdMaterialEntries,
    };
  }

  async updateServiceLog(id: number, userId: string, updates: Partial<InsertServiceLog>): Promise<ServiceLog | undefined> {
    const [updated] = await db
      .update(serviceLogs)
      .set(updates)
      .where(and(eq(serviceLogs.id, id), eq(serviceLogs.userId, userId)))
      .returning();
    return updated;
  }

  async markServiceLogAsPaid(id: number, userId: string): Promise<ServiceLog | undefined> {
    const [updated] = await db
      .update(serviceLogs)
      .set({ isPaymentCollected: true })
      .where(and(eq(serviceLogs.id, id), eq(serviceLogs.userId, userId)))
      .returning();
    return updated;
  }

  async deleteServiceLog(id: number, userId: string): Promise<void> {
    // Delete related entries first
    await db.delete(serviceLogLaborEntries).where(eq(serviceLogLaborEntries.serviceLogId, id));
    await db.delete(serviceLogMaterialEntries).where(eq(serviceLogMaterialEntries.serviceLogId, id));
    // Then delete the service log
    await db.delete(serviceLogs).where(and(eq(serviceLogs.id, id), eq(serviceLogs.userId, userId)));
  }

  // Reminders
  async getReminders(userId: string, clientId?: number): Promise<Reminder[]> {
    const conditions = [eq(reminders.userId, userId)];
    if (clientId) conditions.push(eq(reminders.clientId, clientId));
    
    return await db
      .select()
      .from(reminders)
      .where(and(...conditions))
      .orderBy(desc(reminders.nextDue));
  }

  async createReminder(reminder: InsertReminder & { userId: string }): Promise<Reminder> {
    const [newReminder] = await db.insert(reminders).values(reminder).returning();
    return newReminder;
  }

  async updateReminder(id: number, userId: string, updates: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const [updated] = await db
      .update(reminders)
      .set(updates)
      .where(and(eq(reminders.id, id), eq(reminders.userId, userId)))
      .returning();
    return updated;
  }

  async deleteReminder(id: number, userId: string): Promise<void> {
    await db.delete(reminders).where(and(eq(reminders.id, id), eq(reminders.userId, userId)));
  }

  // Quick Photos
  async getQuickPhotos(userId: string, clientId?: number): Promise<QuickPhoto[]> {
    const conditions = [eq(quickPhotos.userId, userId)];
    if (clientId) conditions.push(eq(quickPhotos.clientId, clientId));
    
    return await db
      .select()
      .from(quickPhotos)
      .where(and(...conditions))
      .orderBy(desc(quickPhotos.createdAt));
  }

  async createQuickPhoto(photo: InsertQuickPhoto & { userId: string }): Promise<QuickPhoto> {
    const [newPhoto] = await db.insert(quickPhotos).values(photo).returning();
    return newPhoto;
  }

  async deleteQuickPhoto(id: number, userId: string): Promise<void> {
    await db.delete(quickPhotos).where(and(eq(quickPhotos.id, id), eq(quickPhotos.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
