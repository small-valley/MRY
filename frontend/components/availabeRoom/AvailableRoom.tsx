import './AvailableRoom.scss';
import { AvailableRooms } from '../../../shared/models/responses/getAvailabilityResponse';
import { Dispatch, SetStateAction } from 'react';

const BASE_CLASS = 'room';

type Props = {
  rooms: AvailableRooms[];
  roomId: string;
  setRoomId: Dispatch<SetStateAction<string>>;
};
export default function AvailableRoom({ rooms, roomId, setRoomId }: Props) {
  return (
    <>
      <div className={BASE_CLASS}>
        <ul className={`${BASE_CLASS}_wrap`}>
          {rooms.map((room, index) => (
            <li
              key={`${index}-${room}-${room.id}`}
              className={roomId === room.id ? 'selected' : ''}
              onClick={() => {
                setRoomId(room.id);
              }}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
