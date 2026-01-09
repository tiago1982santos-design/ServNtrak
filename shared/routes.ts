import { z } from 'zod';
import { insertClientSchema, insertAppointmentSchema, insertServiceLogSchema, insertReminderSchema, insertQuickPhotoSchema, clients, appointments, serviceLogs, reminders, quickPhotos } from './schema';

// Shared error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  clients: {
    list: {
      method: 'GET' as const,
      path: '/api/clients',
      responses: {
        200: z.array(z.custom<typeof clients.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/clients/:id',
      responses: {
        200: z.custom<typeof clients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/clients',
      input: insertClientSchema,
      responses: {
        201: z.custom<typeof clients.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/clients/:id',
      input: insertClientSchema.partial(),
      responses: {
        200: z.custom<typeof clients.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/clients/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments',
      input: z.object({
        clientId: z.string().optional(), // Query param is string, will need coercion
        from: z.string().optional(),
        to: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect & { client: typeof clients.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/appointments/:id',
      input: insertAppointmentSchema.partial(),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/appointments/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  serviceLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/service-logs',
      input: z.object({
        clientId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof serviceLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/service-logs',
      input: insertServiceLogSchema,
      responses: {
        201: z.custom<typeof serviceLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/service-logs/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  reminders: {
    list: {
      method: 'GET' as const,
      path: '/api/reminders',
      input: z.object({
        clientId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof reminders.$inferSelect & { client: typeof clients.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reminders',
      input: insertReminderSchema,
      responses: {
        201: z.custom<typeof reminders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/reminders/:id',
      input: insertReminderSchema.partial(),
      responses: {
        200: z.custom<typeof reminders.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/reminders/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  quickPhotos: {
    list: {
      method: 'GET' as const,
      path: '/api/quick-photos',
      input: z.object({
        clientId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof quickPhotos.$inferSelect & { client: typeof clients.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/quick-photos',
      input: insertQuickPhotoSchema,
      responses: {
        201: z.custom<typeof quickPhotos.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/quick-photos/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
