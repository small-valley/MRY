import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "src/error/notFound.error";
import { IRoomRepository } from "src/repository/interfaces/IRoomRepository";

@Injectable()
export class RoomService {
  @Inject("roomRepository")
  private readonly roomRepository: IRoomRepository;

  async isExistsRoomId(roomId: string): Promise<void | never> {
    const isExistsRoomId = await this.roomRepository.isExistsRoomId(roomId);
    if (!isExistsRoomId) {
      throw new NotFoundError(`Room id: ${roomId} does not exist`);
    }
  }
}
