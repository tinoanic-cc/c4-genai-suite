import { startOfDay, startOfMonth, startOfWeek } from 'date-fns';

export enum GroupBy {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export const getStartDate = (date: Date, groupBy: GroupBy) => {
  switch (groupBy) {
    case GroupBy.Day:
      return startOfDay(date);
    case GroupBy.Week:
      return startOfWeek(date, { weekStartsOn: 1 });
    case GroupBy.Month:
      return startOfMonth(date);
  }
};
