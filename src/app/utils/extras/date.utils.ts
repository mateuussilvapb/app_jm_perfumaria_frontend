export const BR_GMT_DIFF = -3;
export const UM_DIA = 24 * 60 * 60 * 1000;

export interface DateFormat {
  regex: RegExp;
  mustBeAdjusted: boolean;
}

export const DATE_FORMATS: DateFormat[] = [
  { regex: new RegExp('^\\d{4}-\\d{2}-\\d{2}$'), mustBeAdjusted: true },
  {
    regex: new RegExp('^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$'),
    mustBeAdjusted: true,
  },
  {
    regex: new RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$'),
    mustBeAdjusted: true,
  },
  {
    regex: new RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}$'),
    mustBeAdjusted: false,
  },
  {
    regex: new RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{6}$'),
    mustBeAdjusted: false,
  },
];

export const getDateFormat = (dateStr: string): DateFormat | null => {
  if (dateStr == null) {
    return null;
  }
  for (const dateformat of DATE_FORMATS) {
    if (dateformat.regex.test(dateStr)) {
      return dateformat;
    }
  }
  return null;
};

export const isADate = (dateStr: string): boolean =>
  getDateFormat(dateStr) != null;

export const getAdjustedDateIfPossible = (
  dateStr: string
): Date | string | null => {
  if (dateStr == null) {
    return null;
  }

  const dateFormat = getDateFormat(dateStr);
  if (dateFormat == null) {
    return dateStr;
  }

  return dateFormat.mustBeAdjusted
    ? adjustDateTimezone(dateStr)
    : new Date(dateStr);
};

export const adjustDateTimezone = (
  originalDate: Date | string = new Date(),
  gmtDiff = BR_GMT_DIFF
): Date | null => {
  if (originalDate == null) {
    return null;
  } else if (typeof originalDate === 'string') {
    return adjustDateTimezone(new Date(originalDate));
  } else {
    return new Date(originalDate.getTime() - gmtDiff * 3_600_000);
  }
};

export const mesmoDia = (
  dateA: Date | string,
  dateB: Date | string
): boolean => {
  if (dateA == null || dateB == null) {
    return false;
  }
  const dateAStr = typeof dateA === 'string' ? dateA : extractDateString(dateA);
  const dateBStr = typeof dateB === 'string' ? dateB : extractDateString(dateB);
  return dateAStr === dateBStr;
};

export const proximoDia = (date: Date | string): Date | null => {
  if (date == null) {
    return null;
  } else if (typeof date === 'string') {
    return proximoDia(new Date(date));
  } else {
    return new Date(date.getTime() + 86_400_000);
  }
};

export const diaAnterior = (date: Date | string): Date | null => {
  if (date == null) {
    return null;
  } else if (typeof date === 'string') {
    return diaAnterior(new Date(date));
  } else {
    return new Date(date.getTime() - 86_400_000);
  }
};

export const proximoMes = (date: Date | string): Date | null => {
  if (date == null) {
    return null;
  } else if (typeof date === 'string') {
    return proximoMes(new Date(date));
  } else {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month === 11
      ? new Date(year + 1, 0, 1)
      : new Date(year, month + 1, 1);
  }
};

export const mesAnterior = (date: Date | string): Date | null => {
  if (date == null) {
    return null;
  } else if (typeof date === 'string') {
    return mesAnterior(new Date(date));
  } else {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month === 0
      ? new Date(year - 1, 11, 1)
      : new Date(year, month - 1, 1);
  }
};

export const extractDateString = (date: Date): string | null =>
  date != null ? date.toISOString().substring(0, 10) : null;

export const extractMonthString = (date: Date): string | null =>
  date != null ? date.toISOString().substring(0, 7) : null;

export const isDataValida = (date: Date): boolean => {
  if (date) {
    const dataAtual = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
    return (
      dataAtual < new Date(date.getFullYear(), date.getMonth(), date.getDate())
    );
  } else {
    return false;
  }
};

export const plusDays = (date: Date, ammount: number): Date => {
  if (date == null) {
    return null;
  }

  if (ammount === 0) {
    return date;
  }

  const time = ammount * UM_DIA;
  return new Date(date.getTime() + time);
};

export const datesUntil = (start: Date, end: Date): Date[] => {
  if (start == null && end == null) {
    return [];
  }

  if (end == null) {
    return [start];
  }

  if (start == null) {
    return [end];
  }

  if (start.getTime() > end.getTime()) {
    return [];
  }

  if (start.getTime() === end.getTime()) {
    return [start];
  }

  const days = [];
  for (
    let i: Date = new Date(start);
    i.getTime() < end.getTime();
    i = proximoDia(i)
  ) {
    days.push(i);
  }

  return days;
};

export const formatDatePtBr = (date: Date): string => {
  if (date == null) {
    return null;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};
