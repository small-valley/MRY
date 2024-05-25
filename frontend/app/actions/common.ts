import { returnMonthlyCohort } from '@/type/course';
import { BaseResponse } from '../../../shared/models/responses/baseResponse';
import { GetCohortsResponse, Schedule } from '../../../shared/models/responses/getCohortsResponse';
import { GetDaysResponse } from '../../../shared/models/responses/getDaysResponse';
import { GetPeriodsResponse } from '../../../shared/models/responses/getPeriodsResponse';

export function changeDate(date: Date): string {
  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = newDate.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function changeSchoolBreakDate(date: Date): string {
  const newDate = new Date(`${date}T00:00:00-07:00`);

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

export function getBaseDate(month: Date, startDay: number, days: number): string[] {
  const tmpDate = new Date(month);
  console.log(month, tmpDate, startDay);
  tmpDate.setDate(tmpDate.getDate() - startDay + 1);

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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/periods`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/days`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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

export const setCookie = (accessToken: string) => {
  document.cookie = `access_token=${accessToken}; domain=localhost; path=/; SameSite=strict; Secure; max-age=${
    1 * 60 * 60 * 2
  }`;
};

export const deleteCookie = () => {
  // to delete cookie, set expires as past date
  document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; path=/;`;
};

export const getAccessToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];
};

export const getApiData = async <T>(path: string, requireToken: boolean = true): Promise<T | null | Error> => {
  try {
    const accessToken = getAccessToken();
    if (requireToken && !accessToken) {
      return null;
    }

    const response = await fetch(path, {
      method: 'GET',
      headers: requireToken
        ? {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
    });

    const body = (await response.json()) as BaseResponse<T>;

    if (!response.ok) {
      console.error(body?.message || response.statusText);
      return new Error(body?.message || response.statusText);
    }

    return body.data;
  } catch (error: any) {
    console.error(error);
    return new Error(`An error occurred: ${error.message}`);
  }
};

export const postApiData = async <T, K>(path: string, req: T, requireToken: boolean = true): Promise<K | Error> => {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: requireToken
        ? {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
      body: req === null ? null : JSON.stringify(req),
    });

    const body = (await response.json()) as BaseResponse<K>;

    if (!response.ok) {
      console.error(body?.message || response.statusText);
      return new Error(body?.message || response.statusText);
    }

    return body.data;
  } catch (error: any) {
    console.error(error);
    return new Error(`An error occurred: ${error.message}`);
  }
};

export const putApiData = async <T, K>(path: string, req: T, requireToken: boolean = true): Promise<K | Error> => {
  try {
    const response = await fetch(path, {
      method: 'PUT',
      headers: requireToken
        ? {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
      body: req === null ? null : JSON.stringify(req),
    });

    const body = (await response.json()) as BaseResponse<K>;

    if (!response.ok) {
      console.error(body?.message || response.statusText);
      return new Error(body?.message || response.statusText);
    }

    return body.data;
  } catch (error: any) {
    console.error(error);
    return new Error(`An error occurred: ${error.message}`);
  }
};
