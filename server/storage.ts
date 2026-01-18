import { db } from "./db";
import {
  clients, appointments, serviceLogs, reminders, quickPhotos,
  serviceLogLaborEntries, serviceLogMaterialEntries,
  purchaseCategories, stores, purchases, clientPayments,
  serviceVisits, serviceVisitServices,
  financialConfig, monthlyDistributions, employees,
  type InsertClient, type Client,
  type InsertAppointment, type Appointment,
  type InsertServiceLog, type ServiceLog,
  type InsertReminder, type Reminder,
  type InsertQuickPhoto, type QuickPhoto,
  type InsertServiceLogLaborEntry, type ServiceLogLaborEntry,
  type InsertServiceLogMaterialEntry, type ServiceLogMaterialEntry,
  type ServiceLogWithEntries,
  type InsertPurchaseCategory, type PurchaseCategory,
  type InsertStore, type Store,
  type InsertPurchase, type Purchase, type PurchaseWithDetails,
  type InsertClientPayment, type ClientPayment, type ClientPaymentWithClient,
  type InsertServiceVisit, type ServiceVisit, type ServiceVisitWithServices,
  type InsertServiceVisitService, type ServiceVisitService,
  type ClientServiceStats,
  type InsertFinancialConfig, type FinancialConfig,
  type InsertMonthlyDistribution, type MonthlyDistribution,
  type InsertEmployee, type Employee
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

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
    laborEntries: Omit<InsertServiceLogLaborEntry, 'serviceLogId' | 'cost'>[],
    materialEntries: Omit<InsertServiceLogMaterialEntry, 'serviceLogId' | 'cost'>[]
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

  // Purchase Categories
  getPurchaseCategories(userId: string): Promise<PurchaseCategory[]>;
  createPurchaseCategory(category: InsertPurchaseCategory & { userId: string }): Promise<PurchaseCategory>;
  updatePurchaseCategory(id: number, userId: string, updates: Partial<InsertPurchaseCategory>): Promise<PurchaseCategory | undefined>;
  deletePurchaseCategory(id: number, userId: string): Promise<void>;
  initializeDefaultCategories(userId: string): Promise<void>;

  // Stores
  getStores(userId: string): Promise<Store[]>;
  getStore(id: number, userId: string): Promise<Store | undefined>;
  createStore(store: InsertStore & { userId: string }): Promise<Store>;
  updateStore(id: number, userId: string, updates: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: number, userId: string): Promise<void>;

  // Purchases
  getPurchases(userId: string, categoryId?: number, storeId?: number): Promise<PurchaseWithDetails[]>;
  createPurchase(purchase: InsertPurchase & { userId: string }): Promise<Purchase>;
  updatePurchase(id: number, userId: string, updates: Partial<InsertPurchase>): Promise<Purchase | undefined>;
  deletePurchase(id: number, userId: string): Promise<void>;

  // Client Payments
  getClientPayments(userId: string, year?: number, month?: number): Promise<ClientPaymentWithClient[]>;
  getClientPayment(id: number, userId: string): Promise<ClientPayment | undefined>;
  createClientPayment(payment: InsertClientPayment & { userId: string }): Promise<ClientPayment>;
  updateClientPayment(id: number, userId: string, updates: Partial<InsertClientPayment>): Promise<ClientPayment | undefined>;
  markPaymentAsPaid(id: number, userId: string): Promise<ClientPayment | undefined>;
  deleteClientPayment(id: number, userId: string): Promise<void>;
  generateMonthlyPayments(userId: string, year: number, month: number): Promise<ClientPayment[]>;

  // Service Visits
  getServiceVisits(userId: string, clientId?: number): Promise<ServiceVisitWithServices[]>;
  createServiceVisit(
    visit: InsertServiceVisit & { userId: string },
    services: Omit<InsertServiceVisitService, 'visitId'>[]
  ): Promise<ServiceVisitWithServices>;
  getClientServiceStats(userId: string, clientId: number): Promise<ClientServiceStats | undefined>;

  // Financial Config
  getFinancialConfig(userId: string): Promise<FinancialConfig | undefined>;
  createOrUpdateFinancialConfig(userId: string, config: InsertFinancialConfig): Promise<FinancialConfig>;

  // Monthly Distributions
  getMonthlyDistributions(userId: string, year?: number): Promise<MonthlyDistribution[]>;
  getMonthlyDistribution(userId: string, year: number, month: number): Promise<MonthlyDistribution | undefined>;
  calculateAndSaveDistribution(userId: string, year: number, month: number): Promise<MonthlyDistribution>;
  updateMonthlyDistribution(id: number, userId: string, updates: Partial<InsertMonthlyDistribution>): Promise<MonthlyDistribution | undefined>;

  // Employees
  getEmployees(userId: string, includeInactive?: boolean): Promise<Employee[]>;
  getEmployee(id: number, userId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee & { userId: string }): Promise<Employee>;
  updateEmployee(id: number, userId: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined>;
  toggleEmployeeActive(id: number, userId: string): Promise<Employee | undefined>;
  deleteEmployee(id: number, userId: string): Promise<void>;
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
    laborEntries: Omit<InsertServiceLogLaborEntry, 'serviceLogId' | 'cost'>[],
    materialEntries: Omit<InsertServiceLogMaterialEntry, 'serviceLogId' | 'cost'>[]
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

  // Purchase Categories
  async getPurchaseCategories(userId: string): Promise<PurchaseCategory[]> {
    return await db
      .select()
      .from(purchaseCategories)
      .where(eq(purchaseCategories.userId, userId))
      .orderBy(purchaseCategories.name);
  }

  async createPurchaseCategory(category: InsertPurchaseCategory & { userId: string }): Promise<PurchaseCategory> {
    const [newCategory] = await db.insert(purchaseCategories).values(category).returning();
    return newCategory;
  }

  async updatePurchaseCategory(id: number, userId: string, updates: Partial<InsertPurchaseCategory>): Promise<PurchaseCategory | undefined> {
    const [updated] = await db
      .update(purchaseCategories)
      .set(updates)
      .where(and(eq(purchaseCategories.id, id), eq(purchaseCategories.userId, userId)))
      .returning();
    return updated;
  }

  async deletePurchaseCategory(id: number, userId: string): Promise<void> {
    await db.delete(purchaseCategories).where(and(eq(purchaseCategories.id, id), eq(purchaseCategories.userId, userId)));
  }

  async initializeDefaultCategories(userId: string): Promise<void> {
    const existing = await this.getPurchaseCategories(userId);
    if (existing.length > 0) return;

    const defaultCategories = [
      'Jardim',
      'Rega',
      'Piscina',
      'Jacuzzi',
      'Fitofarmacêuticos',
      'Combustíveis',
      'Máquinas',
    ];

    for (const name of defaultCategories) {
      await db.insert(purchaseCategories).values({
        userId,
        name,
        isDefault: true,
      });
    }
  }

  // Stores
  async getStores(userId: string): Promise<Store[]> {
    return await db
      .select()
      .from(stores)
      .where(eq(stores.userId, userId))
      .orderBy(stores.name);
  }

  async getStore(id: number, userId: string): Promise<Store | undefined> {
    const [store] = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, id), eq(stores.userId, userId)));
    return store;
  }

  async createStore(store: InsertStore & { userId: string }): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }

  async updateStore(id: number, userId: string, updates: Partial<InsertStore>): Promise<Store | undefined> {
    const [updated] = await db
      .update(stores)
      .set(updates)
      .where(and(eq(stores.id, id), eq(stores.userId, userId)))
      .returning();
    return updated;
  }

  async deleteStore(id: number, userId: string): Promise<void> {
    await db.delete(stores).where(and(eq(stores.id, id), eq(stores.userId, userId)));
  }

  // Purchases
  async getPurchases(userId: string, categoryId?: number, storeId?: number): Promise<PurchaseWithDetails[]> {
    const conditions = [eq(purchases.userId, userId)];
    if (categoryId) conditions.push(eq(purchases.categoryId, categoryId));
    if (storeId) conditions.push(eq(purchases.storeId, storeId));

    const result = await db
      .select({
        purchase: purchases,
        store: stores,
        category: purchaseCategories,
        client: clients,
      })
      .from(purchases)
      .innerJoin(stores, eq(purchases.storeId, stores.id))
      .innerJoin(purchaseCategories, eq(purchases.categoryId, purchaseCategories.id))
      .leftJoin(clients, and(eq(purchases.clientId, clients.id), eq(clients.userId, purchases.userId)))
      .where(and(...conditions))
      .orderBy(desc(purchases.purchaseDate));

    return result.map(r => ({
      ...r.purchase,
      store: r.store,
      category: r.category,
      client: r.client,
    }));
  }

  async createPurchase(purchase: InsertPurchase & { userId: string }): Promise<Purchase> {
    // Validate that clientId belongs to the same user if provided
    if (purchase.clientId) {
      const [client] = await db.select().from(clients).where(
        and(eq(clients.id, purchase.clientId), eq(clients.userId, purchase.userId))
      );
      if (!client) {
        throw new Error("Cliente não encontrado ou não autorizado");
      }
    }
    const [newPurchase] = await db.insert(purchases).values(purchase).returning();
    return newPurchase;
  }

  async updatePurchase(id: number, userId: string, updates: Partial<InsertPurchase>): Promise<Purchase | undefined> {
    // Validate that clientId belongs to the same user if provided
    if (updates.clientId) {
      const [client] = await db.select().from(clients).where(
        and(eq(clients.id, updates.clientId), eq(clients.userId, userId))
      );
      if (!client) {
        throw new Error("Cliente não encontrado ou não autorizado");
      }
    }
    const [updated] = await db
      .update(purchases)
      .set(updates)
      .where(and(eq(purchases.id, id), eq(purchases.userId, userId)))
      .returning();
    return updated;
  }

  async deletePurchase(id: number, userId: string): Promise<void> {
    await db.delete(purchases).where(and(eq(purchases.id, id), eq(purchases.userId, userId)));
  }

  // Client Payments
  async getClientPayments(userId: string, year?: number, month?: number): Promise<ClientPaymentWithClient[]> {
    const conditions = [eq(clientPayments.userId, userId)];
    if (year) conditions.push(eq(clientPayments.year, year));
    if (month) conditions.push(eq(clientPayments.month, month));

    const result = await db
      .select({
        payment: clientPayments,
        client: clients,
      })
      .from(clientPayments)
      .innerJoin(clients, eq(clientPayments.clientId, clients.id))
      .where(and(...conditions))
      .orderBy(desc(clientPayments.year), desc(clientPayments.month), clientPayments.clientId);

    return result.map(r => ({
      ...r.payment,
      client: r.client,
    }));
  }

  async getClientPayment(id: number, userId: string): Promise<ClientPayment | undefined> {
    const [payment] = await db
      .select()
      .from(clientPayments)
      .where(and(eq(clientPayments.id, id), eq(clientPayments.userId, userId)));
    return payment;
  }

  async createClientPayment(payment: InsertClientPayment & { userId: string }): Promise<ClientPayment> {
    const [newPayment] = await db.insert(clientPayments).values(payment).returning();
    return newPayment;
  }

  async updateClientPayment(id: number, userId: string, updates: Partial<InsertClientPayment>): Promise<ClientPayment | undefined> {
    const [updated] = await db
      .update(clientPayments)
      .set(updates)
      .where(and(eq(clientPayments.id, id), eq(clientPayments.userId, userId)))
      .returning();
    return updated;
  }

  async markPaymentAsPaid(id: number, userId: string): Promise<ClientPayment | undefined> {
    const [updated] = await db
      .update(clientPayments)
      .set({ isPaid: true, paidAt: new Date() })
      .where(and(eq(clientPayments.id, id), eq(clientPayments.userId, userId)))
      .returning();
    return updated;
  }

  async deleteClientPayment(id: number, userId: string): Promise<void> {
    await db.delete(clientPayments).where(and(eq(clientPayments.id, id), eq(clientPayments.userId, userId)));
  }

  async generateMonthlyPayments(userId: string, year: number, month: number): Promise<ClientPayment[]> {
    const userClients = await this.getClients(userId);
    const monthlyClients = userClients.filter(c => c.billingType === 'monthly' && c.monthlyRate);
    
    const existingPayments = await db
      .select()
      .from(clientPayments)
      .where(and(
        eq(clientPayments.userId, userId),
        eq(clientPayments.year, year),
        eq(clientPayments.month, month)
      ));
    
    const existingClientIds = new Set(existingPayments.map(p => p.clientId));
    const newPayments: ClientPayment[] = [];
    
    for (const client of monthlyClients) {
      if (!existingClientIds.has(client.id)) {
        const [payment] = await db.insert(clientPayments).values({
          userId,
          clientId: client.id,
          year,
          month,
          amount: client.monthlyRate!,
          isPaid: false,
        }).returning();
        newPayments.push(payment);
      }
    }
    
    return newPayments;
  }

  // Service Visits
  async getServiceVisits(userId: string, clientId?: number): Promise<ServiceVisitWithServices[]> {
    const conditions = [eq(serviceVisits.userId, userId)];
    if (clientId) conditions.push(eq(serviceVisits.clientId, clientId));

    const visits = await db
      .select()
      .from(serviceVisits)
      .where(and(...conditions))
      .orderBy(desc(serviceVisits.visitDate));

    const result: ServiceVisitWithServices[] = [];
    for (const visit of visits) {
      const services = await db
        .select()
        .from(serviceVisitServices)
        .where(eq(serviceVisitServices.visitId, visit.id));
      result.push({ ...visit, services });
    }

    return result;
  }

  async createServiceVisit(
    visit: InsertServiceVisit & { userId: string },
    services: Omit<InsertServiceVisitService, 'visitId'>[]
  ): Promise<ServiceVisitWithServices> {
    const [newVisit] = await db.insert(serviceVisits).values(visit).returning();

    const insertedServices: ServiceVisitService[] = [];
    for (const service of services) {
      const [s] = await db.insert(serviceVisitServices).values({
        ...service,
        visitId: newVisit.id,
      }).returning();
      insertedServices.push(s);
    }

    // If there's an appointment linked, mark it as completed
    if (visit.appointmentId) {
      await db
        .update(appointments)
        .set({ isCompleted: true })
        .where(and(
          eq(appointments.id, visit.appointmentId),
          eq(appointments.userId, visit.userId)
        ));
    }

    return { ...newVisit, services: insertedServices };
  }

  async getClientServiceStats(userId: string, clientId: number): Promise<ClientServiceStats | undefined> {
    const visits = await this.getServiceVisits(userId, clientId);

    if (visits.length === 0) return undefined;

    let totalDuration = 0;
    let totalWorkers = 0;
    const serviceBreakdown: Record<string, number> = {};

    for (const visit of visits) {
      totalDuration += visit.actualDurationMinutes;
      totalWorkers += visit.workerCount;

      for (const service of visit.services) {
        serviceBreakdown[service.serviceType] = (serviceBreakdown[service.serviceType] || 0) + 1;
      }
    }

    const totalWorkerHours = visits.reduce(
      (sum, v) => sum + (v.actualDurationMinutes * v.workerCount) / 60,
      0
    );

    return {
      clientId,
      totalVisits: visits.length,
      averageDurationMinutes: Math.round(totalDuration / visits.length),
      averageWorkerCount: Math.round((totalWorkers / visits.length) * 10) / 10,
      totalWorkerHours: Math.round(totalWorkerHours * 10) / 10,
      serviceBreakdown,
    };
  }

  // Financial Config
  async getFinancialConfig(userId: string): Promise<FinancialConfig | undefined> {
    const [config] = await db
      .select()
      .from(financialConfig)
      .where(and(eq(financialConfig.userId, userId), eq(financialConfig.isActive, true)));
    return config;
  }

  async createOrUpdateFinancialConfig(userId: string, config: InsertFinancialConfig): Promise<FinancialConfig> {
    const existing = await this.getFinancialConfig(userId);
    
    if (existing) {
      const [updated] = await db
        .update(financialConfig)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(financialConfig.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newConfig] = await db
      .insert(financialConfig)
      .values({ ...config, userId })
      .returning();
    return newConfig;
  }

  // Monthly Distributions
  async getMonthlyDistributions(userId: string, year?: number): Promise<MonthlyDistribution[]> {
    if (year) {
      return await db
        .select()
        .from(monthlyDistributions)
        .where(and(eq(monthlyDistributions.userId, userId), eq(monthlyDistributions.year, year)))
        .orderBy(desc(monthlyDistributions.month));
    }
    return await db
      .select()
      .from(monthlyDistributions)
      .where(eq(monthlyDistributions.userId, userId))
      .orderBy(desc(monthlyDistributions.year), desc(monthlyDistributions.month));
  }

  async getMonthlyDistribution(userId: string, year: number, month: number): Promise<MonthlyDistribution | undefined> {
    const [dist] = await db
      .select()
      .from(monthlyDistributions)
      .where(and(
        eq(monthlyDistributions.userId, userId),
        eq(monthlyDistributions.year, year),
        eq(monthlyDistributions.month, month)
      ));
    return dist;
  }

  async calculateAndSaveDistribution(userId: string, year: number, month: number): Promise<MonthlyDistribution> {
    // Get current financial config
    const config = await this.getFinancialConfig(userId);
    const salaryPercentage = config?.salaryPercentage ?? 40;
    const companyPercentage = config?.companyPercentage ?? 60;

    // Get all paid payments for the month
    const payments = await this.getClientPayments(userId, year, month);
    const paidPayments = payments.filter(p => p.isPaid);
    const totalReceived = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    // Calculate distribution
    const salaryAmount = Math.round((totalReceived * salaryPercentage / 100) * 100) / 100;
    const companyAmount = Math.round((totalReceived * companyPercentage / 100) * 100) / 100;

    // Check if distribution already exists
    const existing = await this.getMonthlyDistribution(userId, year, month);

    if (existing) {
      // Only update if not locked
      if (!existing.isLocked) {
        const [updated] = await db
          .update(monthlyDistributions)
          .set({
            totalReceived,
            salaryAmount,
            companyAmount,
            salaryPercentageUsed: salaryPercentage,
            updatedAt: new Date()
          })
          .where(eq(monthlyDistributions.id, existing.id))
          .returning();
        return updated;
      }
      return existing;
    }

    // Create new distribution
    const [newDist] = await db
      .insert(monthlyDistributions)
      .values({
        userId,
        year,
        month,
        totalReceived,
        salaryAmount,
        companyAmount,
        salaryPercentageUsed: salaryPercentage
      })
      .returning();
    return newDist;
  }

  async updateMonthlyDistribution(id: number, userId: string, updates: Partial<InsertMonthlyDistribution>): Promise<MonthlyDistribution | undefined> {
    const [updated] = await db
      .update(monthlyDistributions)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(monthlyDistributions.id, id), eq(monthlyDistributions.userId, userId)))
      .returning();
    return updated;
  }

  // Employees
  async getEmployees(userId: string, includeInactive: boolean = false): Promise<Employee[]> {
    if (includeInactive) {
      return await db.select().from(employees).where(eq(employees.userId, userId)).orderBy(desc(employees.createdAt));
    }
    return await db.select().from(employees).where(and(eq(employees.userId, userId), eq(employees.isActive, true))).orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: number, userId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(and(eq(employees.id, id), eq(employees.userId, userId)));
    return employee;
  }

  async createEmployee(employee: InsertEmployee & { userId: string }): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, userId: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [updated] = await db
      .update(employees)
      .set(updates)
      .where(and(eq(employees.id, id), eq(employees.userId, userId)))
      .returning();
    return updated;
  }

  async toggleEmployeeActive(id: number, userId: string): Promise<Employee | undefined> {
    const employee = await this.getEmployee(id, userId);
    if (!employee) return undefined;
    
    const [updated] = await db
      .update(employees)
      .set({ isActive: !employee.isActive })
      .where(and(eq(employees.id, id), eq(employees.userId, userId)))
      .returning();
    return updated;
  }

  async deleteEmployee(id: number, userId: string): Promise<void> {
    await db.delete(employees).where(and(eq(employees.id, id), eq(employees.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
