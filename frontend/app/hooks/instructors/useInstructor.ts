import { useState, useEffect, useCallback } from "react";
import { GetInstructorResponse } from "../../../../shared/models/responses/getInstructorResponse";
import { getInstructorById } from "@/app/actions/instructors";

const useInstructor = (id: string) => {
  const [instructor, setInstructor] = useState<GetInstructorResponse>();

  const fetchInstructor = useCallback(async (id: string) => {
    const instructorData = await getInstructorById(id);
    setInstructor(instructorData);
  }, []);

  useEffect(() => {
    if (id) {
      fetchInstructor(id);
    }
  }, [fetchInstructor]);

  return { instructor, fetchInstructor };
};

export default useInstructor;
