import { db } from "./db";
import {
  clients, appointments, serviceLogs, reminders, quickPhotos,
  type InsertClient, type Client,
  type InsertAppointment, type Appointment,
  type InsertServiceLog, type ServiceLog,
  type InsertReminder, type Reminder,
  type InsertQuickPhoto, type QuickPhoto
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
  createServiceLog(log: InsertServiceLog & { userId: string }): Promise<ServiceLog>;
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

  async createServiceLog(log: InsertServiceLog & { userId: string }): Promise<ServiceLog> {
    const [newLog] = await db.insert(serviceLogs).values(log).returning();
    return newLog;
  }

  async deleteServiceLog(id: number, userId: string): Promise<void> {
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
