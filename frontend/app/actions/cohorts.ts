import { GetAvailabilityResponse } from '../../../shared/models/responses/getAvailabilityResponse';
import { GetCohortResponse } from '../../../shared/models/responses/getCohortResponse';
import { PostCohortResponse } from '../../../shared/models/responses/postCohortResponse';
import {
  PutScheduleCourseRequest,
  PutScheduleInstructorOrRoomRequest,
} from '../../../shared/models/requests/putScheduleRequest';

import { PostCohortRequest } from '../../../shared/models/requests/postCohortRequest';
import { GetRecentCohortResponse } from '../../../shared/models/responses/getRecentCohortResponse';

export const getCohortById = async (id: string): Promise<GetCohortResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts/${id}`;

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

export const getRecentCohortByProgram = async (id: string): Promise<GetRecentCohortResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts/recent/${id}`;

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

export const getAvailabilityBySchedule = async (id: string): Promise<GetAvailabilityResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/availability/${id}`;

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

export const deleteSchedule = async (id: string) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedules/${id}`;

    const response = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const updateIntructorRoom = async (course: PutScheduleInstructorOrRoomRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedules/instructor/room`;
    const response = await fetch(baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const updateSchedule = async (schedule: PutScheduleCourseRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedules/course`;
    const response = await fetch(baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const createCohort = async (cohort: PostCohortRequest): Promise<PostCohortResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cohort),
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
