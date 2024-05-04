import { InjectRepository } from "@nestjs/typeorm";
import { IRoomRepository } from "src/repository/interfaces/IRoomRepository";
import { Repository } from "typeorm";
import { Room } from "../entities/room.entity";

export class RoomRepository implements IRoomRepository {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {}

  async isExistsRoomId(roomId: string): Promise<boolean> {
    return await this.roomRepository.exists({
      where: { id: roomId, isDeleted: false },
    });
  }
}
