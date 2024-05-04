import Image from "next/image";
import { GetInstructorResponse } from "../../../shared/models/responses/getInstructorResponse";
const BASE_CLASS = "instructors_content_list_content";
type Props = {
  instructor: GetInstructorResponse;
};

export default function InstructorListRow({ instructor }: Props) {
  return (
    <>
      <div className={`${BASE_CLASS}_profile`}>
        {instructor.avatarUrl == "" ? (
          <Image
            src="https://i.imgur.com/T2WwVfS.png"
            alt="avatar"
            width={35}
            height={35}
          />
        ) : (
          <Image
            src={instructor.avatarUrl}
            alt="avatar"
            width={35}
            height={35}
          />
        )}
      </div>

      <div className={`${BASE_CLASS}_name`}>
        <div>{instructor.firstName}</div>
        <div>{instructor.lastName}</div>
      </div>
      <div className={`${BASE_CLASS}_status`}>
        {instructor.isActive ? (
          <p className="active">Active</p>
        ) : (
          <p className="inActive">No</p>
        )}
      </div>
      <div className={`${BASE_CLASS}_hour`}>
        <p className="hours">{instructor.hourType}</p>
      </div>
    </>
  );
}
