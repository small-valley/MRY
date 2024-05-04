import { useState, useEffect, useCallback } from "react";
import { GetInstructorResponse } from "../../../../shared/models/responses/getInstructorResponse";
import { getInstructor } from "@/app/actions/instructors";

const useInstructorlist = () => {
  const [instructors, setInstructor] = useState<GetInstructorResponse[]>();

  const fetchInstructorlist = useCallback(async () => {
    const instructorData = await getInstructor();
    setInstructor(instructorData);
  }, []);

  useEffect(() => {
    fetchInstructorlist();
  }, [fetchInstructorlist]);

  return { instructors, fetchInstructorlist };
};

export default useInstructorlist;
