import type { Client } from "./schema";

export type Season = "high" | "low";

export function getSeason(date: Date): Season {
  const month = date.getMonth() + 1; // 1-12
  // High season: April (4) to September (9)
  // Low season: October (10) to March (3)
  if (month >= 4 && month <= 9) {
    return "high";
  }
  return "low";
}

export function getSeasonLabel(season: Season): string {
  return season === "high" ? "Época Alta" : "Época Baixa";
}

export function getSeasonDateRange(season: Season, year: number): { start: Date; end: Date } {
  if (season === "high") {
    return {
      start: new Date(year, 3, 1), // April 1st
      end: new Date(year, 8, 30), // September 30th
    };
  }
  // Low season spans two years
  return {
    start: new Date(year, 9, 1), // October 1st
    end: new Date(year + 1, 2, 31), // March 31st next year
  };
}

export interface VisitSchedule {
  type: "Garden" | "Pool" | "Jacuzzi";
  visitsPerMonth: number;
  description: string;
}

export function getGardenVisitsPerMonth(client: Client, season: Season): number {
  if (!client.hasGarden) return 0;
  
  // If client has special "once monthly" agreement
  if (client.gardenVisitFrequency === "once_monthly") {
    return 1;
  }
  
  // Standard seasonal schedule
  return season === "high" ? 2 : 1;
}

export function getPoolVisitsPerMonth(season: Season): number {
  // High season: 1x per week = 4 per month
  // Low season: 2x per month
  return season === "high" ? 4 : 2;
}

export function getJacuzziVisitsPerMonth(season: Season): number {
  // Same as pool
  return season === "high" ? 4 : 2;
}

export function getClientVisitSchedule(client: Client, date: Date = new Date()): VisitSchedule[] {
  const season = getSeason(date);
  const schedules: VisitSchedule[] = [];
  
  if (client.hasGarden) {
    const visits = getGardenVisitsPerMonth(client, season);
    const isSpecial = client.gardenVisitFrequency === "once_monthly";
    schedules.push({
      type: "Garden",
      visitsPerMonth: visits,
      description: isSpecial 
        ? "1 visita/mês (acordo especial)"
        : season === "high" 
          ? "2 visitas/mês (época alta)"
          : "1 visita/mês (época baixa)",
    });
  }
  
  if (client.hasPool) {
    const visits = getPoolVisitsPerMonth(season);
    schedules.push({
      type: "Pool",
      visitsPerMonth: visits,
      description: season === "high" 
        ? "1 visita/semana (época alta)"
        : "2 visitas/mês (época baixa)",
    });
  }
  
  if (client.hasJacuzzi) {
    const visits = getJacuzziVisitsPerMonth(season);
    schedules.push({
      type: "Jacuzzi",
      visitsPerMonth: visits,
      description: season === "high" 
        ? "1 visita/semana (época alta)"
        : "2 visitas/mês (época baixa)",
    });
  }
  
  return schedules;
}

export function getTotalMonthlyVisits(client: Client, date: Date = new Date()): number {
  const schedules = getClientVisitSchedule(client, date);
  return schedules.reduce((total, schedule) => total + schedule.visitsPerMonth, 0);
}

export function generateSuggestedDates(
  year: number,
  month: number, // 1-12
  visitsPerMonth: number,
  serviceType: "Garden" | "Pool" | "Jacuzzi"
): Date[] {
  const dates: Date[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  if (visitsPerMonth <= 0) return dates;
  
  if (visitsPerMonth === 1) {
    // Middle of the month
    dates.push(new Date(year, month - 1, 15));
  } else if (visitsPerMonth === 2) {
    // Every 2 weeks: around 7th and 21st
    dates.push(new Date(year, month - 1, 7));
    dates.push(new Date(year, month - 1, 21));
  } else if (visitsPerMonth === 4) {
    // Weekly: around 1st, 8th, 15th, 22nd
    dates.push(new Date(year, month - 1, 1));
    dates.push(new Date(year, month - 1, 8));
    dates.push(new Date(year, month - 1, 15));
    dates.push(new Date(year, month - 1, 22));
  } else {
    // Distribute evenly
    const interval = Math.floor(daysInMonth / visitsPerMonth);
    for (let i = 0; i < visitsPerMonth; i++) {
      const day = Math.min(1 + i * interval, daysInMonth);
      dates.push(new Date(year, month - 1, day));
    }
  }
  
  return dates;
}

export interface SuggestedAppointment {
  clientId: number;
  clientName: string;
  date: Date;
  type: "Garden" | "Pool" | "Jacuzzi";
}

export function generateMonthlyAppointments(
  clients: Client[],
  year: number,
  month: number
): SuggestedAppointment[] {
  const appointments: SuggestedAppointment[] = [];
  const referenceDate = new Date(year, month - 1, 15);
  
  for (const client of clients) {
    const schedules = getClientVisitSchedule(client, referenceDate);
    
    for (const schedule of schedules) {
      const dates = generateSuggestedDates(year, month, schedule.visitsPerMonth, schedule.type);
      
      for (const date of dates) {
        appointments.push({
          clientId: client.id,
          clientName: client.name,
          date,
          type: schedule.type,
        });
      }
    }
  }
  
  // Sort by date
  appointments.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return appointments;
}
