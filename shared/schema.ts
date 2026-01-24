import { pgTable, text, serial, boolean, timestamp, integer, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Owner of the client record
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  whatsapp: text("whatsapp"), // WhatsApp number (can be different from phone)
  facebookMessenger: text("facebook_messenger"), // Facebook Messenger username or profile ID
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  hasGarden: boolean("has_garden").default(false),
  hasPool: boolean("has_pool").default(false),
  hasJacuzzi: boolean("has_jacuzzi").default(false),
  // Garden visit frequency: 'seasonal' (2x high season, 1x low) or 'once_monthly' (1x all year)
  gardenVisitFrequency: text("garden_visit_frequency").default("seasonal"),
  // Pool dimensions in meters
  poolLength: doublePrecision("pool_length"),
  poolWidth: doublePrecision("pool_width"),
  poolMinDepth: doublePrecision("pool_min_depth"),
  poolMaxDepth: doublePrecision("pool_max_depth"),
  // Jacuzzi dimensions in meters
  jacuzziLength: doublePrecision("jacuzzi_length"),
  jacuzziWidth: doublePrecision("jacuzzi_width"),
  jacuzziDepth: doublePrecision("jacuzzi_depth"),
  // Estimated service duration in minutes for scheduling
  serviceDurationMinutes: integer("service_duration_minutes").default(60),
  notes: text("notes"),
  billingType: text("billing_type").default("monthly"), // 'monthly' or 'hourly'
  monthlyRate: doublePrecision("monthly_rate"), // Fixed monthly amount in euros
  hourlyRate: doublePrecision("hourly_rate"), // Hourly rate in euros
  // Payment method: 'cash', 'bank_transfer', 'mbway'
  paymentMethod: text("payment_method"),
  // Day of month when scheduled transfer is made (only for bank_transfer)
  scheduledTransferDay: integer("scheduled_transfer_day"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'Garden', 'Pool', 'Jacuzzi', 'General'
  notes: text("notes"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceLogs = pgTable("service_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'Garden', 'Pool', 'Jacuzzi', 'General'
  description: text("description").notNull(), // What was done
  photosBefore: text("photos_before").array(), // URLs of before photos
  photosAfter: text("photos_after").array(), // URLs of after photos
  // Billing fields
  billingType: text("billing_type").default("monthly"), // 'monthly' (included) or 'extra' (additional charge)
  laborSubtotal: doublePrecision("labor_subtotal").default(0),
  materialsSubtotal: doublePrecision("materials_subtotal").default(0),
  totalAmount: doublePrecision("total_amount").default(0),
  isPaymentCollected: boolean("is_payment_collected").default(false), // Only for extra services
  createdAt: timestamp("created_at").defaultNow(),
});

// Labor entries for service logs
export const serviceLogLaborEntries = pgTable("service_log_labor_entries", {
  id: serial("id").primaryKey(),
  serviceLogId: integer("service_log_id").notNull(),
  employeeId: integer("employee_id"), // Optional - links to employee
  workerName: text("worker_name").notNull(),
  hours: doublePrecision("hours").notNull(),
  hourlyRate: doublePrecision("hourly_rate").notNull(), // Rate charged to client
  hourlyPayRate: doublePrecision("hourly_pay_rate"), // Rate paid to employee
  cost: doublePrecision("cost").notNull(), // hours * hourlyRate
  createdAt: timestamp("created_at").defaultNow(),
});

// Material entries for service logs
export const serviceLogMaterialEntries = pgTable("service_log_material_entries", {
  id: serial("id").primaryKey(),
  serviceLogId: integer("service_log_id").notNull(),
  materialName: text("material_name").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  cost: doublePrecision("cost").notNull(), // quantity * unitPrice
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'Garden', 'Pool', 'Jacuzzi', 'General'
  frequency: text("frequency").notNull(), // 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'
  nextDue: timestamp("next_due").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quickPhotos = pgTable("quick_photos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  photoUrl: text("photo_url").notNull(),
  serviceType: text("service_type").notNull().default("Geral"), // 'Jardim', 'Piscina', 'Jacuzzi', 'Outros'
  customCategory: text("custom_category"), // Custom folder name when serviceType is 'Outros'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Purchase categories (Jardim, Rega, Piscina, Jacuzzi, Fitofarmacêuticos, Combustíveis, Máquinas, custom)
export const purchaseCategories = pgTable("purchase_categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false), // Pre-populated categories
  createdAt: timestamp("created_at").defaultNow(),
});

// Stores/suppliers information
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  taxId: text("tax_id"), // NIF/Contribuinte
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client monthly payments tracking
export const clientPayments = pgTable("client_payments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(), // 1-12
  amount: doublePrecision("amount").notNull(),
  isPaid: boolean("is_paid").default(false),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service visits - tracks actual completion data for statistics
export const serviceVisits = pgTable("service_visits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  appointmentId: integer("appointment_id"), // Optional link to original appointment
  visitDate: timestamp("visit_date").notNull(),
  actualDurationMinutes: integer("actual_duration_minutes").notNull(), // Real time spent
  workerCount: integer("worker_count").notNull().default(1), // Number of workers
  notes: text("notes"),
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services performed during a visit (for combo visits)
export const serviceVisitServices = pgTable("service_visit_services", {
  id: serial("id").primaryKey(),
  visitId: integer("visit_id").notNull(),
  serviceType: text("service_type").notNull(), // 'Garden', 'Pool', 'Jacuzzi', 'General'
  wasPlanned: boolean("was_planned").default(true), // Was this service in the original appointment
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Purchase records
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  storeId: integer("store_id").notNull(),
  categoryId: integer("category_id").notNull(),
  clientId: integer("client_id"), // Optional - link purchase to a specific client
  productName: text("product_name").notNull(),
  quantity: doublePrecision("quantity").notNull().default(1),
  totalWithoutDiscount: doublePrecision("total_without_discount").notNull(), // Valor total sem desconto
  discountValue: doublePrecision("discount_value").default(0), // Valor do desconto
  finalTotal: doublePrecision("final_total").notNull(), // Valor final pago
  purchaseDate: timestamp("purchase_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Owner
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  hourlyPayRate: doublePrecision("hourly_pay_rate").notNull(), // What the employee is paid per hour
  hourlyChargeRate: doublePrecision("hourly_charge_rate").notNull(), // What is charged to client per hour
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pending tasks - work to be done on future visits
export const pendingTasks = pgTable("pending_tasks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  description: text("description").notNull(),
  serviceType: text("service_type").notNull(), // 'Jardim', 'Piscina', 'Jacuzzi', 'Geral'
  photos: text("photos").array(), // URLs of photos showing the issue
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  serviceLogId: integer("service_log_id"), // Link to service log when completed
  createdAt: timestamp("created_at").defaultNow(),
});

// Suggested works - extra work suggestions for clients
export const suggestedWorks = pgTable("suggested_works", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  title: text("title").notNull(), // e.g., "Lavagem de calçada", "Plantar arbustos"
  description: text("description"), // Detailed description of the suggested work
  notes: text("notes"), // Additional notes: measurements, quantities, materials needed
  category: text("category").notNull(), // 'Jardim', 'Piscina', 'Jacuzzi', 'Geral', 'Limpeza', 'Instalação'
  photos: text("photos").array(), // Photos showing where/what work is suggested
  estimatedCost: integer("estimated_cost"), // Optional cost estimate in cents
  estimatedDurationMinutes: integer("estimated_duration_minutes"), // Optional duration estimate in minutes
  isAccepted: boolean("is_accepted").default(false), // Client accepted the suggestion
  isRejected: boolean("is_rejected").default(false), // Client rejected the suggestion
  isCompleted: boolean("is_completed").default(false), // Work has been done
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  serviceLogs: many(serviceLogs),
  reminders: many(reminders),
  quickPhotos: many(quickPhotos),
  payments: many(clientPayments),
  pendingTasks: many(pendingTasks),
}));

export const clientPaymentsRelations = relations(clientPayments, ({ one }) => ({
  client: one(clients, {
    fields: [clientPayments.clientId],
    references: [clients.id],
  }),
}));

export const quickPhotosRelations = relations(quickPhotos, ({ one }) => ({
  client: one(clients, {
    fields: [quickPhotos.clientId],
    references: [clients.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  client: one(clients, {
    fields: [reminders.clientId],
    references: [clients.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
}));

export const serviceLogsRelations = relations(serviceLogs, ({ one, many }) => ({
  client: one(clients, {
    fields: [serviceLogs.clientId],
    references: [clients.id],
  }),
  laborEntries: many(serviceLogLaborEntries),
  materialEntries: many(serviceLogMaterialEntries),
}));

export const serviceLogLaborEntriesRelations = relations(serviceLogLaborEntries, ({ one }) => ({
  serviceLog: one(serviceLogs, {
    fields: [serviceLogLaborEntries.serviceLogId],
    references: [serviceLogs.id],
  }),
  employee: one(employees, {
    fields: [serviceLogLaborEntries.employeeId],
    references: [employees.id],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  laborEntries: many(serviceLogLaborEntries),
}));

export const serviceLogMaterialEntriesRelations = relations(serviceLogMaterialEntries, ({ one }) => ({
  serviceLog: one(serviceLogs, {
    fields: [serviceLogMaterialEntries.serviceLogId],
    references: [serviceLogs.id],
  }),
}));

export const purchaseCategoriesRelations = relations(purchaseCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [purchaseCategories.userId],
    references: [users.id],
  }),
  purchases: many(purchases),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  store: one(stores, {
    fields: [purchases.storeId],
    references: [stores.id],
  }),
  category: one(purchaseCategories, {
    fields: [purchases.categoryId],
    references: [purchaseCategories.id],
  }),
  client: one(clients, {
    fields: [purchases.clientId],
    references: [clients.id],
  }),
}));

export const pendingTasksRelations = relations(pendingTasks, ({ one }) => ({
  client: one(clients, {
    fields: [pendingTasks.clientId],
    references: [clients.id],
  }),
  serviceLog: one(serviceLogs, {
    fields: [pendingTasks.serviceLogId],
    references: [serviceLogs.id],
  }),
}));

export const serviceVisitsRelations = relations(serviceVisits, ({ one, many }) => ({
  client: one(clients, {
    fields: [serviceVisits.clientId],
    references: [clients.id],
  }),
  appointment: one(appointments, {
    fields: [serviceVisits.appointmentId],
    references: [appointments.id],
  }),
  services: many(serviceVisitServices),
}));

export const serviceVisitServicesRelations = relations(serviceVisitServices, ({ one }) => ({
  visit: one(serviceVisits, {
    fields: [serviceVisitServices.visitId],
    references: [serviceVisits.id],
  }),
}));

// Financial configuration for income distribution
export const financialConfig = pgTable("financial_config", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  salaryPercentage: doublePrecision("salary_percentage").notNull().default(40), // % for salary
  companyPercentage: doublePrecision("company_percentage").notNull().default(60), // % for company
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Monthly income distributions
export const monthlyDistributions = pgTable("monthly_distributions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(), // 1-12
  totalReceived: doublePrecision("total_received").notNull().default(0), // Total from paid client payments
  salaryAmount: doublePrecision("salary_amount").notNull().default(0), // Amount for salary
  companyAmount: doublePrecision("company_amount").notNull().default(0), // Amount for company
  salaryPercentageUsed: doublePrecision("salary_percentage_used").notNull(), // Snapshot of % used
  notes: text("notes"),
  isLocked: boolean("is_locked").default(false), // Prevent recalculation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialConfigRelations = relations(financialConfig, ({ one }) => ({
  user: one(users, {
    fields: [financialConfig.userId],
    references: [users.id],
  }),
}));

export const monthlyDistributionsRelations = relations(monthlyDistributions, ({ one }) => ({
  user: one(users, {
    fields: [monthlyDistributions.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, userId: true, createdAt: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, userId: true, createdAt: true });
export const insertServiceLogSchema = createInsertSchema(serviceLogs).omit({ id: true, userId: true, createdAt: true });
export const insertReminderSchema = createInsertSchema(reminders).omit({ id: true, userId: true, createdAt: true });
export const insertQuickPhotoSchema = createInsertSchema(quickPhotos).omit({ id: true, userId: true, createdAt: true });
export const insertServiceLogLaborEntrySchema = createInsertSchema(serviceLogLaborEntries).omit({ id: true, createdAt: true });
export const insertServiceLogMaterialEntrySchema = createInsertSchema(serviceLogMaterialEntries).omit({ id: true, createdAt: true });
export const insertPurchaseCategorySchema = createInsertSchema(purchaseCategories).omit({ id: true, userId: true, createdAt: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true, userId: true, createdAt: true });
export const insertPurchaseSchema = createInsertSchema(purchases).omit({ id: true, userId: true, createdAt: true });
export const insertClientPaymentSchema = createInsertSchema(clientPayments).omit({ id: true, userId: true, createdAt: true });
export const insertServiceVisitSchema = createInsertSchema(serviceVisits).omit({ id: true, userId: true, createdAt: true, completedAt: true });
export const insertServiceVisitServiceSchema = createInsertSchema(serviceVisitServices).omit({ id: true, createdAt: true });
export const insertFinancialConfigSchema = createInsertSchema(financialConfig).omit({ id: true, userId: true, createdAt: true, updatedAt: true });
export const insertMonthlyDistributionSchema = createInsertSchema(monthlyDistributions).omit({ id: true, userId: true, createdAt: true, updatedAt: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, userId: true, createdAt: true });
export const insertPendingTaskSchema = createInsertSchema(pendingTasks).omit({ id: true, userId: true, createdAt: true, completedAt: true, serviceLogId: true });

export const insertSuggestedWorkSchema = createInsertSchema(suggestedWorks).omit({ id: true, userId: true, createdAt: true, acceptedAt: true, rejectedAt: true, completedAt: true });

// === TYPES ===

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type ServiceLog = typeof serviceLogs.$inferSelect;
export type InsertServiceLog = z.infer<typeof insertServiceLogSchema>;

export type ServiceLogLaborEntry = typeof serviceLogLaborEntries.$inferSelect;
export type InsertServiceLogLaborEntry = z.infer<typeof insertServiceLogLaborEntrySchema>;

export type ServiceLogMaterialEntry = typeof serviceLogMaterialEntries.$inferSelect;
export type InsertServiceLogMaterialEntry = z.infer<typeof insertServiceLogMaterialEntrySchema>;

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type QuickPhoto = typeof quickPhotos.$inferSelect;
export type InsertQuickPhoto = z.infer<typeof insertQuickPhotoSchema>;

// Extended types for service logs with entries
export type ServiceLogWithEntries = ServiceLog & {
  laborEntries: ServiceLogLaborEntry[];
  materialEntries: ServiceLogMaterialEntry[];
};

export type PurchaseCategory = typeof purchaseCategories.$inferSelect;
export type InsertPurchaseCategory = z.infer<typeof insertPurchaseCategorySchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

// Extended type for purchase with store and category
export type PurchaseWithDetails = Purchase & {
  store: Store;
  category: PurchaseCategory;
  client?: Client | null;
};

export type ClientPayment = typeof clientPayments.$inferSelect;
export type InsertClientPayment = z.infer<typeof insertClientPaymentSchema>;

// Extended type for client payment with client info
export type ClientPaymentWithClient = ClientPayment & {
  client: Client;
};

export type ServiceVisit = typeof serviceVisits.$inferSelect;
export type InsertServiceVisit = z.infer<typeof insertServiceVisitSchema>;

export type ServiceVisitService = typeof serviceVisitServices.$inferSelect;
export type InsertServiceVisitService = z.infer<typeof insertServiceVisitServiceSchema>;

// Extended type for service visit with services
export type ServiceVisitWithServices = ServiceVisit & {
  services: ServiceVisitService[];
};

// Client statistics from visits
export type ClientServiceStats = {
  clientId: number;
  totalVisits: number;
  averageDurationMinutes: number;
  averageWorkerCount: number;
  totalWorkerHours: number;
  serviceBreakdown: Record<string, number>; // Count per service type
};

export type FinancialConfig = typeof financialConfig.$inferSelect;
export type InsertFinancialConfig = z.infer<typeof insertFinancialConfigSchema>;

export type MonthlyDistribution = typeof monthlyDistributions.$inferSelect;
export type InsertMonthlyDistribution = z.infer<typeof insertMonthlyDistributionSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

// Extended type for labor entry with employee details
export type ServiceLogLaborEntryWithEmployee = ServiceLogLaborEntry & {
  employee?: Employee | null;
};

export type PendingTask = typeof pendingTasks.$inferSelect;
export type InsertPendingTask = z.infer<typeof insertPendingTaskSchema>;

// Extended type for pending task with client
export type PendingTaskWithClient = PendingTask & {
  client: Client;
};

export type SuggestedWork = typeof suggestedWorks.$inferSelect;
export type InsertSuggestedWork = z.infer<typeof insertSuggestedWorkSchema>;

// Extended type for suggested work with client
export type SuggestedWorkWithClient = SuggestedWork & {
  client: Client;
};
