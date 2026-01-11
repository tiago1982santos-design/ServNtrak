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
  notes: text("notes"),
  billingType: text("billing_type").default("monthly"), // 'monthly' or 'hourly'
  monthlyRate: doublePrecision("monthly_rate"), // Fixed monthly amount in euros
  hourlyRate: doublePrecision("hourly_rate"), // Hourly rate in euros
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
  workerName: text("worker_name").notNull(),
  hours: doublePrecision("hours").notNull(),
  hourlyRate: doublePrecision("hourly_rate").notNull(),
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

// Purchase records
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  storeId: integer("store_id").notNull(),
  categoryId: integer("category_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: doublePrecision("quantity").notNull().default(1),
  totalWithoutDiscount: doublePrecision("total_without_discount").notNull(), // Valor total sem desconto
  discountValue: doublePrecision("discount_value").default(0), // Valor do desconto
  finalTotal: doublePrecision("final_total").notNull(), // Valor final pago
  purchaseDate: timestamp("purchase_date").notNull(),
  notes: text("notes"),
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
};

export type ClientPayment = typeof clientPayments.$inferSelect;
export type InsertClientPayment = z.infer<typeof insertClientPaymentSchema>;

// Extended type for client payment with client info
export type ClientPaymentWithClient = ClientPayment & {
  client: Client;
};
