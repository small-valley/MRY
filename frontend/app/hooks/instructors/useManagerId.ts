import { useState, useEffect } from "react";
import { GetInstructorResponse } from "../../../../shared/models/responses/getInstructorResponse";
import { BaseResponse } from '../../../../shared/models/responses/baseResponse';
import { getAccessToken } from '@/app/actions/common';
import useSWR from 'swr';

const useManagerId = () => {
  const [receiverId, setReceiverId] = useState<string>('');

  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/managers`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    };
    const fetcher = (url: string) => fetch(url, options).then((res) => res.json());
    const { data } = useSWR<BaseResponse<GetInstructorResponse[]>>(baseUrl, fetcher);

    const managers = data?.data;

    useEffect(() => {
      setReceiverId(managers ? managers[0]?.id : ''); // set receiverId to the first manager's id
    }, [managers]);
  } catch (error) {
    console.error('Error:', error);
  }

  return { receiverId };
};

export default useManagerId;
