import { returnMonthlyCohort } from '@/type/course';
import { GetCohortsResponse, Schedule } from '../../../shared/models/responses/getCohortsResponse';
import { GetPeriodsResponse } from '../../../shared/models/responses/getPeriodsResponse';
import { GetDaysResponse } from '../../../shared/models/responses/getDaysResponse';

export function changeDate(date: Date): string {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = newDate.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
export function MockchangeDate(date: Date): string {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = newDate.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function getBaseDate(month: string, startDay: number, days: number): string[] {
  const tmpDate = new Date(month);
  tmpDate.setDate(tmpDate.getDate() - startDay + 2);

  const cnt_week = Math.ceil((days + startDay - 1) / 7);
  const baseDate = [changeDate(tmpDate)];
  for (let i = 1; i < cnt_week; i++) {
    tmpDate.setDate(tmpDate.getDate() + 7);
    baseDate.push(changeDate(tmpDate));
  }

  return baseDate;
}

export function getCoursesByBaseDate(cohorts: GetCohortsResponse[], baseDate: string[]): returnMonthlyCohort[] {
  const montlyCohorts: returnMonthlyCohort[] = [];
  cohorts.map((item) => {
    baseDate.forEach((date) => {
      const schedules: Schedule[] = [];
      item.schedules.forEach((obj) => {
        const tmpDate = new Date(date);
        const startDate = new Date(obj.startDate);
        const endDate = new Date(obj.endDate);
        if (tmpDate >= startDate && tmpDate <= endDate) {
          schedules.push(obj);
        }
      });

      if (schedules.length != 0) {
        const tmpData: returnMonthlyCohort = {
          baseDate: date,
          name: item.name,
          period: item.period,
          room: item.room,
          schedules: schedules,
        };
        montlyCohorts.push(tmpData);
      }
    });
  });

  return montlyCohorts;
}

export const getPeriod = async (): Promise<GetPeriodsResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/periods`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const getDays = async (): Promise<GetDaysResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/days`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};
