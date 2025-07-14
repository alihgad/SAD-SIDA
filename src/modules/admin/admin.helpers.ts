import { GetRevenueArgs } from "./admin.type";

export function getDateRange(args: GetRevenueArgs): { startDate: Date; endDate: Date } {
  const now = new Date();

  function parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // local date
  }

  if (args.start && args.end) {
    return {
      startDate: parseLocalDate(args.start),
      endDate: parseLocalDate(args.end),
    };
  }

  if (args.type === 'monthly') {
    const month = args.month ?? now.getMonth() + 1;
    const year = args.year ?? now.getFullYear();

    return {
      startDate: new Date(year, month - 1, 1),
      endDate: new Date(year, month, 1),
    };
  }

  if (args.type === 'yearly') {
    const year = args.year ?? now.getFullYear();

    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year + 1, 0, 1),
    };
  }

  // Default: last 30 days
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 30);
  return {
    startDate: defaultStart,
    endDate: now,
  };
}
